import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("connection")
@Index(["organizationId", "sourceId", "destinationId"], { unique: true })
export class Connection extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  organizationId: string;

  @Index()
  @Column()
  sourceId: string;

  @Index()
  @Column()
  destinationId: string;

  @Column({ type: "boolean", default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
