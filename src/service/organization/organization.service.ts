import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateOrganizationDto } from "src/dtos";
import { Organization, UserOrganization, UserRole } from "src/entities";
import { createId } from "src/utils/help";
import { Repository } from "typeorm";

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(UserOrganization)
    private readonly userOrganizationRepository: Repository<UserOrganization>,
  ) {}

  async createOrganization(org: CreateOrganizationDto, userId: string) {
    try {
      const id = createId("org");
      const newOrg = await this.organizationRepository.save({
        ...org,
        id: id,
      });

      await this.userOrganizationRepository.save({
        id: createId("userOrg"),
        userId,
        organizationId: newOrg.id,
        role: UserRole.OWNER,
      });

      return newOrg;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getOrganizationById(id: string) {
    try {
      const organization = await this.organizationRepository.findOne({
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

  async getOrganizationsByUserId(userId: string) {
    try {
      const userOrganizations = await this.userOrganizationRepository.find({
        where: { userId },
        order: { createdAt: "DESC" },
      });

      return userOrganizations;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getOrganizationByUserIdAndOrgId(userId: string, orgId: string) {
    try {
      const userOrganization = await this.userOrganizationRepository.findOne({
        where: { userId, organizationId: orgId },
      });

      return userOrganization;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
