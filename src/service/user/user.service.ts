import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { CreateUserDto } from "src/dtos";
import { User } from "src/entities";
import { createId } from "src/utils/help";
import { EntityManager } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async findByEmail(email: string) {
    try {
      const user = this.entityManager.findOne(User, { where: { email } });

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
      const newUser = this.entityManager.create(User, { ...user, id: id });
      await this.entityManager.save(User, newUser);

      return newUser;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.entityManager.findOne(User, {
        where: { id },
      });

      if (!user) {
        throw new HttpException(
          "User with this id does not exist",
          HttpStatus.BAD_REQUEST,
        );
      }

      return user;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async patchUser(id: string, user: Partial<User>) {
    try {
      const existingUser = await this.entityManager.findOne(User, {
        where: { id },
      });

      if (!existingUser) {
        throw new HttpException(
          "User with this id does not exist",
          HttpStatus.BAD_REQUEST,
        );
      }

      const updatedUser = this.entityManager.create(User, {
        ...existingUser,
        ...user,
      });

      await this.entityManager.update(User, { id }, updatedUser);
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
      const user = await this.entityManager.findOne(User, { where: { email } });

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

  async validateRefreshToken(userId: string, refreshToken: string) {
    try {
      const user = await this.entityManager.findOne(User, {
        where: { id: userId },
      });

      if (user && (await user.compareRefreshToken(refreshToken))) {
        return user;
      }

      throw new HttpException(
        "Invalid refresh token.",
        HttpStatus.UNAUTHORIZED,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
