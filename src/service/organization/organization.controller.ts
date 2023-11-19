import { Controller } from "@nestjs/common";
import { OrganizationService } from "./organization.service";

@Controller("auth")
export class OrganizationController {
  constructor(private readonly orgService: OrganizationService) {}
}
