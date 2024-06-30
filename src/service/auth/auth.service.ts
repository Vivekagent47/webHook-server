import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto, LoginDto, ReturnTokenDto } from "src/dtos";
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

  async login(loginData: LoginDto): Promise<ReturnTokenDto> {
    try {
      const user = await this.userService.validateUser(
        loginData.email,
        loginData.password,
      );

      const userOrgs = await this.orgService.getUserOrganizations(user.id);

      const tokens = await this.generateAuthToken(user, {
        orgId: userOrgs[0].id,
        role: userOrgs[0].role,
      });

      await this.userService.patchUser(user.id, {
        refreshToken: tokens.refreshToken,
      });

      return {
        ...tokens,
      };
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async registerUser(user: CreateUserDto): Promise<ReturnTokenDto> {
    try {
      const newUser = await this.userService.createUser(user);
      await this.orgService.createOrganization(
        {
          name: `${user.email}'s organization`,
        },
        newUser.id,
      );

      const userOrgs = await this.orgService.getUserOrganizations(newUser.id);

      const tokens = await this.generateAuthToken(newUser, {
        orgId: userOrgs[0].id,
        role: userOrgs[0].role,
      });

      await this.userService.patchUser(newUser.id, {
        refreshToken: tokens.refreshToken,
      });

      return {
        ...tokens,
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
    delete user.password;
    delete user.refreshToken;

    const accessToken = this.jwtService.sign({
      type: "access",
      role: orgData.role,
      email: user.email,
      user: user,
      orgId: orgData.orgId,
    });

    const refreshToken = this.jwtService.sign(
      {
        sub: () => user.email,
        type: "refresh",
        orgId: orgData.orgId,
        userId: user.id,
      },
      {
        expiresIn: "2d",
      },
    );

    return { accessToken, refreshToken };
  }

  async tokenRefresh(refreshToken: string): Promise<ReturnTokenDto> {
    try {
      const decoded = this.jwtService.verify(refreshToken);

      if (decoded.type !== "refresh") {
        throw new HttpException("Invalid token", HttpStatus.BAD_REQUEST);
      }

      const user = await this.userService.validateRefreshToken(
        decoded.userId,
        refreshToken,
      );
      const userOrgs = await this.orgService.getUserOrganizations(user.id);
      const userOrg = userOrgs.find((item) => item.id === decoded.orgId);

      if (!userOrg || !user) {
        throw new HttpException("Invalid token", HttpStatus.BAD_REQUEST);
      }

      const tokens = await this.generateAuthToken(user, {
        orgId: userOrg.id,
        role: userOrg.role,
      });

      await this.userService.patchUser(user.id, {
        refreshToken: tokens.refreshToken,
      });

      return {
        ...tokens,
      };
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async logout(userId: string): Promise<{
    status: HttpStatus;
    message: string;
  }> {
    try {
      await this.userService.patchUser(userId, {
        refreshToken: null,
      });

      return {
        status: HttpStatus.OK,
        message: "User logged out successfully",
      };
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async changeOrg(userId: string, orgId: string) {
    try {
      const userOrgs = await this.orgService.getUserOrganizations(userId);
      const userOrg = userOrgs.find((item) => item.id === orgId);

      if (!userOrg) {
        throw new HttpException(
          "User does not belong to the organization",
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.userService.getUserById(userId);
      const tokens = await this.generateAuthToken(user, {
        orgId: userOrg.id,
        role: userOrg.role,
      });

      await this.userService.patchUser(user.id, {
        refreshToken: tokens.refreshToken,
      });

      return {
        ...tokens,
      };
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
