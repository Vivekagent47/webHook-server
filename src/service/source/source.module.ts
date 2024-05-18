import { forwardRef, Module } from "@nestjs/common";
import { ConnectionModule } from "src/service";
import { SourceController } from "./source.controller";
import { SourceService } from "./source.service";

@Module({
  imports: [forwardRef(() => ConnectionModule)],
  providers: [SourceService],
  controllers: [SourceController],
  exports: [SourceService],
})
export class SourceModule {}
