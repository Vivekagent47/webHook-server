import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { UserRole } from "src/entities";
import { AuthUser, IAuthUserDecorator, Roles } from "src/utils/decorators";
import { RoleGuard, UserAuthGuard } from "src/utils/guards";
import { OrganizationService } from "./organization.service";

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
}
