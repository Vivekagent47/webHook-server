import { forwardRef, Module } from "@nestjs/common";
import { ConnectionModule } from "src/service";
import { DestinationController } from "./destination.controller";
import { DestinationService } from "./destination.service";

@Module({
  imports: [forwardRef(() => ConnectionModule)],
  controllers: [DestinationController],
  providers: [DestinationService],
  exports: [DestinationService],
})
export class DestinationModule {}
