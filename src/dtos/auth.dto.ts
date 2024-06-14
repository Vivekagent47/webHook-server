import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Matches } from "class-validator";

export class LoginDto {
  @ApiProperty({
    description: "Email of the user",
    example: "user@gmail.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Password of the user.",
    example: "Password@123",
  })
  @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
  @IsNotEmpty()
  password: string;
}

export class ReturnTokenDto {
  @ApiProperty({
    description: "Access token of the user.",
  })
  accessToken: string;
  @ApiProperty({
    description: "Refresh token of the user.",
  })
  refreshToken: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    description: "Refresh token of the user.",
  })
  @IsNotEmpty()
  refreshToken: string;
}
