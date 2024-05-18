import { forwardRef, Module } from "@nestjs/common";
import { DestinationModule, SourceModule } from "src/service";
import { ConnectionController } from "./connection.controller";
import { ConnectionService } from "./connection.service";

@Module({
  imports: [
    forwardRef(() => SourceModule),
    forwardRef(() => DestinationModule),
  ],
  providers: [ConnectionService],
  controllers: [ConnectionController],
  exports: [ConnectionService],
})
export class ConnectionModule {}
