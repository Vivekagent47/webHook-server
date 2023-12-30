import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CreateUserDto, LoginDto } from "src/dtos";
import { AuthUser, IAuthUserDecorator } from "src/utils/decorators";
import { UserAuthGuard } from "src/utils/guards";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() data: LoginDto) {
    try {
      return await this.authService.login(data);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post("register")
  async register(@Body() data: CreateUserDto) {
    try {
      return await this.authService.registerUser(data);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(UserAuthGuard)
  @Post("logout")
  async logout(@AuthUser() user: IAuthUserDecorator) {
    try {
      return await this.authService.logout(user.user.id);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post("refresh")
  async refreshToken(@Body() data: { refreshToken: string }) {
    try {
      return await this.authService.tokenRefresh(data.refreshToken);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
