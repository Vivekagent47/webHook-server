import { IsEmail, IsNotEmpty } from "class-validator";
import { User, UserOrganization } from "src/entities";

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
  userOrganizations: UserOrganization[];
}

export class RefreshTokenDto {
  @IsNotEmpty()
  refreshToken: string;
}
