import { Module, forwardRef } from "@nestjs/common";
import { OrganizationModule, UserModule } from "src/service";
import { JWTModule } from "src/utils/jwt.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [
    forwardRef(() => JWTModule),
    forwardRef(() => UserModule),
    forwardRef(() => OrganizationModule),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
