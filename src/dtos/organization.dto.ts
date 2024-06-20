import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { UserRole } from "src/entities";

export class CreateOrganizationDto {
  @ApiProperty({
    example: "Organization Name",
    type: String,
    description: "The name of the organization",
  })
  @IsNotEmpty()
  name: string;
}

export class AddMemberDto {
  @ApiProperty({
    example: "user2@gmail.com",
    type: String,
    description:
      "The email of the user to be added to the organization and user need to already exist in the system",
  })
  @IsNotEmpty()
  @IsEmail()
  userEmail: string;

  @ApiProperty({
    example: "admin",
    enum: UserRole,
    description: "The role of the user in the organization",
  })
  @IsEnum(UserRole)
  role: UserRole;
}

export class UpdateOrganizationDto {
  @ApiProperty({
    example: "Organization Name",
    type: String,
    description: "The name of the organization",
  })
  @IsNotEmpty()
  name: string;
}

export class UpdateMemberDto {
  @ApiProperty({
    example: "admin",
    enum: UserRole,
    description: "The role of the user in the organization",
  })
  @IsEnum(UserRole)
  role: UserRole;
}
