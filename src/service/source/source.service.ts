import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { CreateSourceDto, UpdateSourceDto } from "src/dtos/source.dto";
import { Source } from "src/entities";
import { ConnectionService } from "src/service";
import { createId } from "src/utils/help";
import { EntityManager } from "typeorm";

@Injectable()
export class SourceService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,

    @Inject(forwardRef(() => ConnectionService))
    private readonly connectionService: ConnectionService,
  ) {}

  async getAllSources(orgId: string) {
    try {
      const sources = await this.entityManager.find(Source, {
        where: { organizationId: orgId },
        order: { createdAt: "DESC" },
      });

      return sources;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getSourceById(id: string, orgId: string) {
    try {
      const source = await this.entityManager.findOne(Source, {
        where: { id, organizationId: orgId },
      });

      return source;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createSource(orgId: string, data: CreateSourceDto) {
    try {
      const source = this.entityManager.create(Source, {
        ...data,
        id: createId("src"),
        organizationId: orgId,
      });

      await this.entityManager.save(source);

      return source;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateSource(id: string, orgId: string, data: UpdateSourceDto) {
    try {
      const source = await this.getSourceById(id, orgId);
      if (!source) {
        throw new HttpException("Source not found", HttpStatus.NOT_FOUND);
      }

      await this.entityManager.update(Source, { id: source.id }, data);

      return {
        status: HttpStatus.OK,
        message: "Source updated successfully",
      };
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteSource(id: string, orgId: string) {
    try {
      await this.entityManager.transaction(async (manager) => {
        await manager.delete(Source, { id, organizationId: orgId });
        await this.connectionService.deleteConnBySourceId(id, orgId);
      });

      return {
        status: HttpStatus.OK,
        message: "Source deleted successfully",
      };
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
