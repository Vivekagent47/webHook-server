import { Module, forwardRef } from "@nestjs/common";
import { UserModule } from "../user";
import { OrganizationController } from "./organization.controller";
import { OrganizationService } from "./organization.service";

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [OrganizationService],
  controllers: [OrganizationController],
  exports: [OrganizationService],
})
export class OrganizationModule {}
