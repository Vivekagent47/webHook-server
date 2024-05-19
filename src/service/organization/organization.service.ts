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
        .select([
          "user.id as id",
          'user.firstName as "firstName"',
          'user.lastName as "lastName"',
          "user.email as email",
          "user_organization.role as role",
          'user.createdAt as "createdAt"',
          'user.updatedAt as "updatedAt"',
        ])
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
      const member = await this.entityManager.transaction(async (manager) => {
        const user = await this.userService.findByEmail(addMember.userEmail);
        if (!user) {
          throw new HttpException("User not found", HttpStatus.BAD_REQUEST);
        }

        const org = await manager.findOne(Organization, {
          where: { id: orgId },
        });

        if (!org) {
          throw new HttpException(
            "Organization not found",
            HttpStatus.BAD_REQUEST,
          );
        }

        const userOrganization = (
          await this.getUserOrganizations(user.id)
        ).find((item) => item.id === org.id);

        if (userOrganization) {
          throw new HttpException(
            "User already in organization",
            HttpStatus.BAD_REQUEST,
          );
        }

        const newMember = manager.create(UserOrganization, {
          id: createId("userOrg"),
          userId: user.email,
          organizationId: org.id,
          role: addMember.role,
        });

        await manager.save(UserOrganization, newMember);

        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: newMember.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      });

      return member;
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

        if (userOrganization.role === UserRole.OWNER) {
          throw new HttpException(
            "Cannot remove owner",
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

  async updateMemberRole(orgId: string, userId: string, role: UserRole) {
    try {
      await this.entityManager.update(
        UserOrganization,
        { organizationId: orgId, userId },
        { role },
      );

      return {
        status: HttpStatus.OK,
        message: "User role updated successfully",
      };
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
