import { ApiProperty } from "@nestjs/swagger";
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
  @ApiProperty({
    example: "user_12345466anjk",
    description: "The id of the user",
  })
  @PrimaryColumn()
  id: string;

  @ApiProperty({
    example: "user@gmail.com",
    type: "string",
    description: "The email of the user",
  })
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

  @ApiProperty({
    example: "John",
    type: "string",
    description: "The first name of the user",
  })
  @Column()
  firstName: string;

  @ApiProperty({
    example: "Doe",
    type: "string",
    description: "The last name of the user",
  })
  @Column()
  lastName: string;

  @ApiProperty({
    example: new Date(),
    type: Date,
    description: "The date the user was created",
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: new Date(),
    type: Date,
    description: "The date the user was last updated",
  })
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
