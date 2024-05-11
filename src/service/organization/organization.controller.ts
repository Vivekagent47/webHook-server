import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { AddMemberDto, UpdateMemberDto, UpdateOrganizationDto } from "src/dtos";
import { UserRole } from "src/entities";
import { AuthUser, IAuthUserDecorator, Roles } from "src/utils/decorators";
import { RoleGuard, UserAuthGuard } from "src/utils/guards";
import { OrganizationService } from "./organization.service";

@Controller("organization")
export class OrganizationController {
  constructor(private readonly orgService: OrganizationService) {}

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
  @UseGuards(UserAuthGuard, RoleGuard)
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
  @UseGuards(UserAuthGuard, RoleGuard)
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

  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @UseGuards(UserAuthGuard, RoleGuard)
  @Delete("/remove-member/:orgId/:userId")
  async removeMember(
    @Param("orgId") orgId: string,
    @Param("userId") userId: string,
    @AuthUser() user: IAuthUserDecorator,
  ) {
    try {
      if (user.orgId !== orgId) {
        throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
      }

      return await this.orgService.removeMemberFromOrganization(
        user.orgId,
        userId,
      );
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @UseGuards(UserAuthGuard, RoleGuard)
  @Patch("/update-member/:orgId/:userId")
  async updateMemberRole(
    @Param("orgId") orgId: string,
    @Param("userId") userId: string,
    @AuthUser() user: IAuthUserDecorator,
    @Body() body: UpdateMemberDto,
  ) {
    try {
      if (user.orgId !== orgId) {
        throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
      }

      if (body.role === UserRole.OWNER) {
        throw new HttpException("Cannot add owner", HttpStatus.BAD_REQUEST);
      }

      return await this.orgService.updateMemberRole(
        user.orgId,
        userId,
        body.role,
      );
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
