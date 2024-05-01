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

export class UpdateOrganizationDto {
  @IsNotEmpty()
  name: string;
}

export class UpdateMemberDto {
  @IsEnum(UserRole)
  role: UserRole;
}
