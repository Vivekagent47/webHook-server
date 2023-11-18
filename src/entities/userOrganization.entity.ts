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
  @PrimaryColumn()
  id: string;

  @Index()
  @Column()
  userId: string;

  @Index()
  @Column()
  organizationId: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
