import * as bcrypt from "bcrypt";
import { Exclude } from "class-transformer";
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("user")
export class User extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @Column({ nullable: true })
  refreshToken: string;

  @BeforeUpdate()
  async hashRefreshToken() {
    const salt = await bcrypt.genSalt(10);
    if (this.refreshToken === null) {
      return;
    }
    this.refreshToken = await bcrypt.hash(this.refreshToken, salt);
  }

  async compareRefreshToken(token: string) {
    return await bcrypt.compare(token, this.refreshToken);
  }
}
