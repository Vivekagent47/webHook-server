import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { CreateConnectionDto, UpdateConnectionDto } from "src/dtos";
import { Connection, Destination, Source } from "src/entities";
import { DestinationService, SourceService } from "src/service";
import { createId } from "src/utils/help";
import { EntityManager } from "typeorm";

@Injectable()
export class ConnectionService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,

    @Inject(forwardRef(() => SourceService))
    private readonly sourceService: SourceService,
    @Inject(forwardRef(() => DestinationService))
    private readonly destinationService: DestinationService,
  ) {}

  async getAllConnections(orgId: string) {
    try {
      const connections = await this.entityManager
        .createQueryBuilder()
        .select()
        .from(Connection, "connection")
        .innerJoinAndMapOne(
          "connection.source",
          Source,
          "source",
          "source.id = connection.sourceId",
        )
        .innerJoinAndMapOne(
          "connection.destination",
          Destination,
          "destination",
          "destination.id = connection.destinationId",
        )
        .where("connection.organizationId = :orgId", { orgId })
        .orderBy("connection.createdAt", "DESC")
        .getMany();

      return connections;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createConnection(orgId: string, data: CreateConnectionDto) {
    try {
      const source = await this.sourceService.getSourceById(
        data.sourceId,
        orgId,
      );
      const destination = await this.destinationService.getDestinationById(
        data.destinationId,
        orgId,
      );

      if (!source || !destination) {
        throw new HttpException(
          "Source or Destination not found",
          HttpStatus.NOT_FOUND,
        );
      }

      const connection = this.entityManager.create(Connection, {
        id: createId("conn"),
        organizationId: orgId,
        sourceId: source.id,
        destinationId: destination.id,
        active: true,
      });

      await this.entityManager.save(connection);

      return connection;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateConnection(id: string, orgId: string, data: UpdateConnectionDto) {
    try {
      const connection = await this.entityManager.findOne(Connection, {
        where: { id, organizationId: orgId },
      });

      if (!connection) {
        throw new HttpException("Connection not found", HttpStatus.NOT_FOUND);
      }

      await this.entityManager.update(Connection, connection.id, {
        active: data.active,
      });
      return {
        status: HttpStatus.OK,
        message: "Connection updated successfully",
      };
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteConnection(id: string, orgId: string) {
    try {
      await this.entityManager.delete(Connection, {
        id,
        organizationId: orgId,
      });

      return {
        status: HttpStatus.OK,
        message: "Connection deleted successfully",
      };
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteConnBySourceId(sourceId: string, orgId: string) {
    try {
      await this.entityManager.delete(Connection, {
        sourceId,
        organizationId: orgId,
      });

      return {
        status: HttpStatus.OK,
        message: "Connection deleted successfully",
      };
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteConnByDestinationId(destinationId: string, orgId: string) {
    try {
      await this.entityManager.delete(Connection, {
        destinationId,
        organizationId: orgId,
      });

      return {
        status: HttpStatus.OK,
        message: "Connection deleted successfully",
      };
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
