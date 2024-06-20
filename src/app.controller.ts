import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: "Get Hello",
    description: "Get Hello from the server to check if the server is running.",
  })
  @ApiResponse({
    status: 200,
    type: String,
    description: "Return 'Hello World!' from the server",
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
