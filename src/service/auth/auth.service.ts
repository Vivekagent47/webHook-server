import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto, LoginDto, ReturnAuthDataDto } from "src/dtos";
import { User } from "src/entities";
import { OrganizationService, UserService } from "src/service";

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => JwtService))
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => OrganizationService))
    private readonly orgService: OrganizationService,
  ) {}

  async login(loginData: LoginDto): Promise<ReturnAuthDataDto> {
    try {
      const user = await this.userService.validateUser(
        loginData.email,
        loginData.password,
      );

      const userOrgs = await this.orgService.getOrganizationsByUserId(user.id);

      const tokens = await this.generateAuthToken(user, {
        orgId: userOrgs[0].organizationId,
        role: userOrgs[0].role,
      });

      return {
        tokens,
        user,
        userOrganizations: userOrgs,
      };
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async registerUser(user: CreateUserDto): Promise<ReturnAuthDataDto> {
    try {
      const newUser = await this.userService.createUser(user);
      await this.orgService.createOrganization(
        {
          name: `${user.firstName} ${user.lastName}'s organization`,
        },
        newUser.id,
      );

      const userOrgs = await this.orgService.getOrganizationsByUserId(
        newUser.id,
      );

      const tokens = await this.generateAuthToken(newUser, {
        orgId: userOrgs[0].organizationId,
        role: userOrgs[0].role,
      });

      return {
        tokens,
        user: newUser,
        userOrganizations: userOrgs,
      };
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async generateAuthToken(
    user: User,
    orgData: {
      orgId: string;
      role: string;
    },
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.jwtService.sign({
      type: "access",
      role: orgData.role,
      email: user.email,
      userId: user.id,
      orgId: orgData.orgId,
    });

    const refreshToken = this.jwtService.sign(
      {
        sub: () => user.email,
        type: "refresh",
        userId: user.id,
      },
      {
        expiresIn: "7d",
      },
    );

    return { accessToken, refreshToken };
  }

  async tokenRefresh(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = this.jwtService.verify(refreshToken);

      if (decoded.type !== "refresh") {
        throw new HttpException("Invalid token", HttpStatus.BAD_REQUEST);
      }

      const user = await this.userService.findByEmail(decoded.email);
      const userOrg = await this.orgService.getOrganizationByUserIdAndOrgId(
        user.id,
        decoded.orgId,
      );

      if (!userOrg || !user) {
        throw new HttpException("Invalid token", HttpStatus.BAD_REQUEST);
      }

      const tokens = await this.generateAuthToken(user, {
        orgId: userOrg.organizationId,
        role: userOrg.role,
      });

      return tokens;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
