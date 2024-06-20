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

@Entity()
export class Organization extends BaseEntity {
  @ApiProperty({
    example: "org_12345466anjk",
    description: "The id of the organization",
  })
  @PrimaryColumn()
  id: string;

  @ApiProperty({
    example: "Organization Name",
    type: "string",
    description: "The name of the organization",
  })
  @Column({ unique: true })
  name: string;

  // @Column()
  // country: string;

  // @Column()
  // address_line1: string;

  // @Column({ nullable: true })
  // address_line2: string;

  // @Column()
  // city: string;

  // @Column()
  // state: string;

  // @Column()
  // zipcode: string;

  @ApiProperty({
    example: new Date(),
    type: Date,
    description: "The date the organization was created",
  })
  @Index()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: new Date(),
    type: Date,
    description: "The date the organization was updated",
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
