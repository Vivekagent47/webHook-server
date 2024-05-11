import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { UpdateUserDto } from "src/dtos";
import { AuthUser, IAuthUserDecorator } from "src/utils/decorators";
import { UserAuthGuard } from "src/utils/guards";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(UserAuthGuard)
  @Get("me")
  async getMyInfo(@AuthUser() user: IAuthUserDecorator) {
    try {
      return await this.userService.findByEmail(user.user.email);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(UserAuthGuard)
  @Patch("me")
  async update(
    @AuthUser() user: IAuthUserDecorator,
    @Body() body: UpdateUserDto,
  ) {
    try {
      return await this.userService.patchUser(user.user.id, body);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
