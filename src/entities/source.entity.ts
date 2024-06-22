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

@Entity("sources")
@Index(["organizationId", "name"], { unique: true })
@Index(["organizationId"])
export class Source extends BaseEntity {
  @ApiProperty({
    description: "The id of the source",
    example: "src_12345466anjk",
  })
  @PrimaryColumn()
  id: string;

  @ApiProperty({
    description: "The name of the source",
    example: "source name",
  })
  @Column()
  name: string;

  @ApiProperty({
    description: "The organization id of the source",
    example: "org_12345466anjk",
  })
  @Column()
  organizationId: string;

  @ApiProperty({
    example: new Date(),
    type: Date,
    description: "The date on which source was created",
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: new Date(),
    type: Date,
    description: "The date on which source was updated",
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
