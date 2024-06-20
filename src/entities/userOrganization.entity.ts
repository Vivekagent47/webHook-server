import { ApiProperty } from "@nestjs/swagger";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

export enum UserRole {
  OWNER = "owner",
  ADMIN = "admin",
  MEMBER = "member",
}

@Entity()
@Index(["userId", "organizationId"], { unique: true })
export class UserOrganization extends BaseEntity {
  @ApiProperty({
    example: "userOrg_12345466anjk",
    description: "The id of the user organization",
  })
  @PrimaryColumn()
  id: string;

  @ApiProperty({
    example: "user_12345466anjk",
    description: "The id of the user",
  })
  @Index()
  @Column()
  userId: string;

  @ApiProperty({
    example: "org_12345466anjk",
    description: "The id of the organization",
  })
  @Index()
  @Column()
  organizationId: string;

  @ApiProperty({
    example: "member",
    enum: UserRole,
    description: "The role of the user in the organization",
  })
  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  role: UserRole;

  @ApiProperty({
    example: new Date(),
    type: Date,
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: new Date(),
    type: Date,
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
