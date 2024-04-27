import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { AddMemberDto, CreateOrganizationDto } from "src/dtos";
import { Organization, User, UserOrganization, UserRole } from "src/entities";
import { OrganizationMember, UserOrganizationData } from "src/types";
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
      const userOrganizations = await this.entityManager
        .createQueryBuilder(Organization, "organization")
        .innerJoin(
          UserOrganization,
          "user_organization",
          "organization.id = user_organization.organizationId",
        )
        .select(["organization.*", "user_organization.role as role"])
        .where("user_organization.userId = :userId", { userId })
        .orderBy("user_organization.createdAt", "DESC")
        .getRawMany();

      return userOrganizations as UserOrganizationData[];
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getOrganizationMembers(orgId: string) {
    try {
      const members = await this.entityManager
        .createQueryBuilder(UserOrganization, "user_organization")
        .innerJoin(User, "user", "user_organization.userId = user.id")
        .select(["user.*", "user_organization.role as role"])
        .where("user_organization.organizationId = :orgId", { orgId })
        .orderBy("user_organization.createdAt", "DESC")
        .getRawMany();

      return members as OrganizationMember[];
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async addMemberToOrganization(orgId: string, addMember: AddMemberDto) {
    try {
      await this.entityManager.transaction(async (manager) => {
        const user = await this.userService.findByEmail(addMember.userEmail);
        if (!user) {
          throw new HttpException("User not found", HttpStatus.BAD_REQUEST);
        }

        const userOrganization = (
          await this.getUserOrganizations(user.id)
        ).find((item) => item.id === orgId);

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

  async removeMemberFromOrganization(orgId: string, userId: string) {
    try {
      await this.entityManager.transaction(async (manager) => {
        const userOrganization = await manager.findOne(UserOrganization, {
          where: { userId, organizationId: orgId },
        });

        if (!userOrganization) {
          throw new HttpException(
            "User not found in organization",
            HttpStatus.BAD_REQUEST,
          );
        }

        await manager.delete(UserOrganization, {
          id: userOrganization.id,
        });
      });

      return {
        status: HttpStatus.OK,
        message: "User removed from organization",
      };
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateOrganizationDetails(orgId: string, org: Partial<Organization>) {
    try {
      await this.entityManager.update(Organization, { id: orgId }, org);
      return {
        status: HttpStatus.OK,
        message: "Organization updated successfully",
      };
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
