import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { UserRole } from "src/entities";
import { Roles } from "src/utils/decorators";
import { RoleGuard, UserAuthGuard } from "src/utils/guards";
import { DestinationService } from "./destination.service";

@Controller("destination")
export class DestinationController {
  constructor(private readonly destinationService: DestinationService) {}

  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER)
  @UseGuards(UserAuthGuard, RoleGuard)
  @Get()
  async getDestinations() {
    try {
      // return await this.destinationService.getAllDestinations();
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
