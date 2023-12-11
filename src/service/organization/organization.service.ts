import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { AddMemberDto, CreateOrganizationDto } from "src/dtos";
import { Organization, UserOrganization, UserRole } from "src/entities";
import { createId } from "src/utils/help";
import { EntityManager } from "typeorm";
import { UserService } from "../user";

@Injectable()
export class OrganizationService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async createOrganization(org: CreateOrganizationDto, userId: string) {
    try {
      const data = await this.entityManager.transaction(async (manager) => {
        const newOrg = await manager.save(Organization, {
          ...org,
          id: createId("org"),
        });

        await manager.save(UserOrganization, {
          id: createId("userOrg"),
          userId,
          organizationId: newOrg.id,
          role: UserRole.OWNER,
        });

        return newOrg;
      });

      return data;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getOrganizationById(id: string) {
    try {
      const organization = await this.entityManager.findOne(Organization, {
        where: { id },
      });

      return organization;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getUserOrganizations(userId: string) {
    try {
      const userOrganizations = await this.entityManager.find(
        UserOrganization,
        {
          where: { userId },
          order: { createdAt: "DESC" },
        },
      );

      return userOrganizations;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async addMemberToOrganization(addMember: AddMemberDto, orgId: string) {
    try {
      await this.entityManager.transaction(async (manager) => {
        const user = await this.userService.findByEmail(addMember.userEmail);
        if (!user) {
          throw new HttpException("User not found", HttpStatus.BAD_REQUEST);
        }

        const userOrganization = (
          await this.getUserOrganizations(user.id)
        ).find((item) => item.organizationId === orgId);

        if (userOrganization) {
          throw new HttpException(
            "User already in organization",
            HttpStatus.BAD_REQUEST,
          );
        }

        await manager.save(UserOrganization, {
          id: createId("userOrg"),
          userId: user.email,
          organizationId: orgId,
          role: addMember.role,
        });
      });

      return {
        status: HttpStatus.OK,
        message: "User added to organization",
      };
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
