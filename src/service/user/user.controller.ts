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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { User } from "src/entities";
import { IPatchResponse } from "src/types";

@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @ApiResponse({
    status: 200,
    description: "Return user information",
    type: User,
  })
  @ApiOperation({
    summary: "Get Me",
    description: "Get own information",
  })
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

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Return user information after update",
    type: IPatchResponse,
  })
  @ApiOperation({
    summary: "Update Me",
    description: "Update own information",
  })
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
