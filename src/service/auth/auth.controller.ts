import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
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
  @ApiOperation({
    summary: "Login user",
    description: "Login user and return access token and refresh token",
  })
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
  @ApiOperation({
    summary: "Register user",
    description: "Register user and return access token and refresh token",
  })
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

  @ApiBearerAuth()
  @ApiResponse({
    status: 204,
    description: "Logout successful",
  })
  @ApiOperation({
    summary: "Logout user",
    description: "Logout user and revoke refresh token",
  })
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
  @ApiOperation({
    summary: "Refresh token",
    description:
      "Generate new access token and refresh token using refresh token",
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

  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: "Return access token and refresh token",
  })
  @ApiOperation({
    summary: "Change Org",
    description:
      "Change user org and return new access token and refresh token",
  })
  @UseGuards(UserAuthGuard)
  @Post("change-org/:orgId")
  async changeOrg(
    @AuthUser() user: IAuthUserDecorator,
    @Param("orgId") orgId: string,
  ) {
    try {
      return await this.authService.changeOrg(user.user.id, orgId);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
