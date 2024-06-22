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
import { CreateSourceDto, UpdateSourceDto } from "src/dtos";
import { Source, UserRole } from "src/entities";
import { AuthUser, IAuthUserDecorator, Roles } from "src/utils/decorators";
import { RoleGuard, UserAuthGuard } from "src/utils/guards";
import { SourceService } from "./source.service";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { IDeleteResponse, IPatchResponse } from "src/types";

@ApiTags("Source")
@Controller("source")
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Returns all sources",
    type: [Source],
  })
  @ApiOperation({
    summary: "Get sources",
    description: "Get all sources of the organization.",
  })
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

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Returns the source",
    type: Source,
  })
  @ApiOperation({
    summary: "Create source",
    description: "Create the source",
  })
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

  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: "Update source.",
    type: IPatchResponse,
  })
  @ApiOperation({
    summary: "Update source",
    description: "Update source details.",
  })
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

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Delete source.",
    type: IDeleteResponse,
  })
  @ApiOperation({
    summary: "Delete source",
    description: "Delete the source.",
  })
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER)
  @UseGuards(UserAuthGuard, RoleGuard)
  @Delete("/:id")
  async deleteSource(
    @AuthUser() user: IAuthUserDecorator,
    @Param("id") id: string,
  ) {
    try {
      return await this.sourceService.deleteSource(id, user.orgId);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
