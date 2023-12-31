import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { UserRole } from "src/entities";

export class CreateOrganizationDto {
  @IsNotEmpty()
  name: string;
}

export class AddMemberDto {
  @IsNotEmpty()
  @IsEmail()
  userEmail: string;

  @IsEnum(UserRole)
  role: UserRole;
}
