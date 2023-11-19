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
  @PrimaryColumn()
  id: string;

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

  @Index()
  @CreateDateColumn()
  created_at: Date;

  @Index()
  @UpdateDateColumn()
  updated_at: Date;
}
