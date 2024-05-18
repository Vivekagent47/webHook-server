import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CreateSourceDto, UpdateSourceDto } from "src/dtos";
import { UserRole } from "src/entities";
import { AuthUser, IAuthUserDecorator, Roles } from "src/utils/decorators";
import { RoleGuard, UserAuthGuard } from "src/utils/guards";
import { SourceService } from "./source.service";

@Controller("source")
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER)
  @UseGuards(UserAuthGuard, RoleGuard)
  @Get()
  async getSources(@AuthUser() user: IAuthUserDecorator) {
    try {
      return await this.sourceService.getAllSources(user.orgId);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER)
  @UseGuards(UserAuthGuard, RoleGuard)
  @Post()
  async createSource(
    @AuthUser() user: IAuthUserDecorator,
    @Body() data: CreateSourceDto,
  ) {
    try {
      return await this.sourceService.createSource(user.orgId, data);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER)
  @UseGuards(UserAuthGuard, RoleGuard)
  @Patch("/:id")
  async updateSource(
    @AuthUser() user: IAuthUserDecorator,
    @Param("id") id: string,
    @Body() data: UpdateSourceDto,
  ) {
    try {
      return await this.sourceService.updateSource(id, user.orgId, data);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
