import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { UserRole } from "src/entities";
import { AuthUser, IAuthUserDecorator, Roles } from "src/utils/decorators";
import { RoleGuard, UserAuthGuard } from "src/utils/guards";
import { OrganizationService } from "./organization.service";
import { AddMemberDto, UpdateOrganizationDto } from "src/dtos";

@Controller("organization")
export class OrganizationController {
  constructor(private readonly orgService: OrganizationService) {}

  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER)
  @UseGuards(UserAuthGuard, RoleGuard)
  @Get()
  async getOrganizationDetails(@AuthUser() user: IAuthUserDecorator) {
    try {
      const data = await this.orgService.getOrganizationById(user.orgId);
      if (!data) {
        throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);
      }

      return data;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER)
  @UseGuards(UserAuthGuard, RoleGuard)
  @Get("/all")
  async getUserOrganizations(@AuthUser() user: IAuthUserDecorator) {
    try {
      return await this.orgService.getUserOrganizations(user.user.id);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @Patch("/update/:id")
  async updateOrganizationDetails(
    @Param("id") orgId: string,
    @AuthUser() user: IAuthUserDecorator,
    @Body() body: UpdateOrganizationDto,
  ) {
    try {
      if (user.orgId !== orgId) {
        throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
      }

      return await this.orgService.updateOrganizationDetails(user.orgId, body);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @Patch("/add-member/:orgId")
  async addMember(
    @Param("orgId") orgId: string,
    @AuthUser() user: IAuthUserDecorator,
    @Body() body: AddMemberDto,
  ) {
    try {
      if (user.orgId !== orgId) {
        throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
      }

      if (body.role === UserRole.OWNER) {
        throw new HttpException("Cannot add owner", HttpStatus.BAD_REQUEST);
      }

      return await this.orgService.addMemberToOrganization(user.orgId, body);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
