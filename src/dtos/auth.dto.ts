import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class ReturnTokenDto {
  accessToken: string;
  refreshToken: string;
}

export class RefreshTokenDto {
  @IsNotEmpty()
  refreshToken: string;
}
