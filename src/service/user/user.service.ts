import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "src/dtos";
import { User } from "src/entities";
import { createId } from "src/utils/help";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      return user;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createUser(user: CreateUserDto) {
    try {
      const existingUser = await this.findByEmail(user.email);

      if (existingUser) {
        throw new HttpException(
          "User with this email already exists",
          HttpStatus.BAD_REQUEST,
        );
      }

      const id = createId("user");
      const newUser = this.userRepository.create({ ...user, id: id });
      await this.userRepository.save(newUser);

      return newUser;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async patchUser(id: string, user: Partial<User>) {
    try {
      const existingUser = await this.userRepository.findOne({ where: { id } });

      if (!existingUser) {
        throw new HttpException(
          "User with this id does not exist",
          HttpStatus.BAD_REQUEST,
        );
      }

      await existingUser.save({ data: { user } });

      return {
        status: HttpStatus.OK,
        message: "User updated successfully",
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (user && (await user.comparePassword(password))) {
        return user;
      }

      throw new HttpException("Invalid creds.", HttpStatus.UNAUTHORIZED);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
