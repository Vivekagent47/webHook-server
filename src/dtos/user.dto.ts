import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Matches } from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    description: "Email of the user",
    example: "user@gmail.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      "Password of the user. \n\n Must contain at least 1 lowercase, 1 uppercase, 1 number and be at least 8 characters long.",
    example: "Password@123",
  })
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "Password must contain at least 1 lowercase, 1 uppercase, 1 number and be at least 8 characters long",
    },
  )
  password: string;

  @ApiProperty({
    description: "First name of the user",
    example: "John",
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: "Last name of the user",
    example: "Doe",
  })
  @IsNotEmpty()
  lastName: string;
}

export class UpdateUserDto {
  @ApiProperty({
    description: "First name of the user",
    example: "John",
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: "Last name of the user",
    example: "Doe",
  })
  @IsNotEmpty()
  lastName: string;
}
