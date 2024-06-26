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
import { AddMemberDto, UpdateMemberDto, UpdateOrganizationDto } from "src/dtos";
import { UserRole } from "src/entities";
import { AuthUser, IAuthUserDecorator, Roles } from "src/utils/decorators";
import { RoleGuard, UserAuthGuard } from "src/utils/guards";
import { OrganizationService } from "./organization.service";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  IDeleteResponse,
  IOrganizationMember,
  IPatchResponse,
  IUserOrganizationData,
} from "src/types";

@ApiTags("Organization")
@Controller("organization")
export class OrganizationController {
  constructor(private readonly orgService: OrganizationService) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Get all organizations you have access.",
    type: [IUserOrganizationData],
  })
  @ApiOperation({
    summary: "Get all organizations",
    description: "Get all organizations you have access.",
  })
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER)
  @UseGuards(UserAuthGuard, RoleGuard)
  @Get("/all")
  async getUserOrganizations(
    @AuthUser() user: IAuthUserDecorator,
  ): Promise<IUserOrganizationData[]> {
    try {
      return await this.orgService.getUserOrganizations(user.user.id);
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
    description: "Update organization.",
    type: IPatchResponse,
  })
  @ApiOperation({
    summary: "Update organization",
    description: "Update organization details.",
  })
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @UseGuards(UserAuthGuard, RoleGuard)
  @Patch("/:id")
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

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Get all members of the organization.",
    type: [IOrganizationMember],
  })
  @ApiOperation({
    summary: "Get all members",
    description: "Get all members of the organization.",
  })
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER)
  @UseGuards(UserAuthGuard, RoleGuard)
  @Get("/members/:orgId")
  async getOrganizationMembers(
    @Param("orgId") orgId: string,
    @AuthUser() user: IAuthUserDecorator,
  ) {
    try {
      if (user.orgId !== orgId) {
        throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
      }

      return await this.orgService.getOrganizationMembers(user.orgId);
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
    description: "Add a new member to the organization.",
    type: IOrganizationMember,
  })
  @ApiOperation({
    summary: "Add member",
    description: "Add a new member to the organization.",
  })
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @UseGuards(UserAuthGuard, RoleGuard)
  @Post("/add-member/:orgId")
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

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Remove a member from the organization.",
    type: IDeleteResponse,
  })
  @ApiOperation({
    summary: "Remove member",
    description: "Remove a member from the organization.",
  })
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

      if (user.user.id === userId) {
        throw new HttpException(
          "Cannot remove yourself",
          HttpStatus.BAD_REQUEST,
        );
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

  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: "Update the role of a member in the organization.",
    type: IPatchResponse,
  })
  @ApiOperation({
    summary: "Update member",
    description: "Update the member in the organization.",
  })
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

      if (user.user.id === userId) {
        throw new HttpException(
          "Cannot update your own role",
          HttpStatus.BAD_REQUEST,
        );
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
