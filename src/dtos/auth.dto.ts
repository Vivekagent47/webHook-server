import { IsEmail, IsNotEmpty } from "class-validator";
import { User, UserOrganization } from "src/entities";

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class ReturnAuthDataDto {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: User;
  userOrganizations: UserOrganization[];
}
