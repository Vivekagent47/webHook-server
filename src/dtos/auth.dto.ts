import { IsEmail, IsNotEmpty } from "class-validator";
import { User } from "src/entities";
import { UserOrganizationData } from "src/types";

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

export class ReturnAuthDataDto {
  tokens: ReturnTokenDto;
  user: User;
  organizations: UserOrganizationData[];
}

export class RefreshTokenDto {
  @IsNotEmpty()
  refreshToken: string;
}
