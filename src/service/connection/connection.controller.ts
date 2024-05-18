import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CreateConnectionDto, UpdateConnectionDto } from "src/dtos";
import { UserRole } from "src/entities";
import { AuthUser, IAuthUserDecorator, Roles } from "src/utils/decorators";
import { RoleGuard, UserAuthGuard } from "src/utils/guards";
import { ConnectionService } from "./connection.service";

@Controller("connection")
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Roles(UserRole.ADMIN, UserRole.OWNER, UserRole.MEMBER)
  @UseGuards(UserAuthGuard, RoleGuard)
  @Get()
  async getAllConnections(@AuthUser() user: IAuthUserDecorator) {
    try {
      return await this.connectionService.getAllConnections(user.orgId);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Roles(UserRole.ADMIN, UserRole.OWNER, UserRole.MEMBER)
  @UseGuards(UserAuthGuard, RoleGuard)
  @Post()
  async createConnection(
    @AuthUser() user: IAuthUserDecorator,
    @Body() data: CreateConnectionDto,
  ) {
    try {
      return await this.connectionService.createConnection(user.orgId, data);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Roles(UserRole.ADMIN, UserRole.OWNER, UserRole.MEMBER)
  @UseGuards(UserAuthGuard, RoleGuard)
  @Patch("/:id")
  async updateConnection(
    @AuthUser() user: IAuthUserDecorator,
    @Param("id") id: string,
    @Body() data: UpdateConnectionDto,
  ) {
    try {
      return await this.connectionService.updateConnection(
        id,
        user.orgId,
        data,
      );
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Roles(UserRole.ADMIN, UserRole.OWNER, UserRole.MEMBER)
  @UseGuards(UserAuthGuard, RoleGuard)
  @Delete("/:id")
  async deleteConnection(
    @AuthUser() user: IAuthUserDecorator,
    @Param("id") id: string,
  ) {
    try {
      return await this.connectionService.deleteConnection(id, user.orgId);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
