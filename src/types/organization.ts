import { ApiProperty } from "@nestjs/swagger";
import { Organization, User, UserRole } from "src/entities";

export class IUserOrganizationData extends Organization {
  @ApiProperty({
    example: "member",
    enum: UserRole,
    description: "The role of the user in the organization",
  })
  role: UserRole;
}

export class IOrganizationMember extends User {
  @ApiProperty({
    example: "member",
    enum: UserRole,
    description: "The role of the user in the organization",
  })
  role: UserRole;
}
