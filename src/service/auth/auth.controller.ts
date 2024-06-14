import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  CreateUserDto,
  LoginDto,
  RefreshTokenDto,
  ReturnTokenDto,
} from "src/dtos";
import { AuthUser, IAuthUserDecorator } from "src/utils/decorators";
import { UserAuthGuard } from "src/utils/guards";
import { AuthService } from "./auth.service";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    type: ReturnTokenDto,
    status: 201,
    description: "Return access token and refresh token",
  })
  @ApiForbiddenResponse({ description: "Invalid credentials", status: 401 })
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

  @ApiResponse({
    type: ReturnTokenDto,
    status: 201,
    description: "Return access token and refresh token",
  })
  @ApiForbiddenResponse({ description: "Invalid credentials", status: 401 })
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

  @ApiResponse({
    status: 204,
    description: "Logout successful",
  })
  @ApiBearerAuth()
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

  @ApiResponse({
    type: ReturnTokenDto,
    status: 201,
    description: "Return access token and refresh token",
  })
  @Post("refresh")
  async refreshToken(@Body() data: RefreshTokenDto) {
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
