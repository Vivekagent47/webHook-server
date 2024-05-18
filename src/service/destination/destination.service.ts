import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { CreateDestinationDto, UpdateDestinationDto } from "src/dtos";
import { Destination } from "src/entities";
import { ConnectionService } from "src/service";
import { createId } from "src/utils/help";
import { EntityManager } from "typeorm";

@Injectable()
export class DestinationService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,

    @Inject(forwardRef(() => ConnectionService))
    private readonly connectionService: ConnectionService,
  ) {}

  async getDestinations(orgId: string) {
    try {
      const destinations = await this.entityManager.find(Destination, {
        where: { organizationId: orgId },
        order: { createdAt: "DESC" },
      });

      return destinations;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getDestinationById(id: string, orgId: string) {
    try {
      const destination = await this.entityManager.findOne(Destination, {
        where: { organizationId: orgId, id },
      });

      return destination;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createDestination(orgId: string, data: CreateDestinationDto) {
    try {
      const destination = this.entityManager.create(Destination, {
        ...data,
        id: createId("dest"),
        organizationId: orgId,
      });

      await this.entityManager.save(destination);

      return destination;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateDestination(
    id: string,
    orgId: string,
    data: UpdateDestinationDto,
  ) {
    try {
      const destination = await this.getDestinationById(id, orgId);
      if (!destination) {
        throw new HttpException("Destination not found", HttpStatus.NOT_FOUND);
      }

      await this.entityManager.update(
        Destination,
        { id: destination.id },
        data,
      );

      return {
        status: HttpStatus.OK,
        message: "Destination updated successfully",
      };
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteDestination(id: string, orgId: string) {
    try {
      await this.entityManager.transaction(async (manager) => {
        await manager.delete(Destination, { id, organizationId: orgId });
        await this.connectionService.deleteConnByDestinationId(id, orgId);
      });

      return {
        status: HttpStatus.OK,
        message: "Destination deleted successfully",
      };
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
