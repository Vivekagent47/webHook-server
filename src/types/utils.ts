import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class IPatchResponse {
  @ApiProperty({
    example: 200,
    description: "Status code of the response",
  })
  status: HttpStatus;

  @ApiProperty({
    example: "Data updated successfully",
    description: "Message of the response",
  })
  message: string;
}

export class IDeleteResponse {
  @ApiProperty({
    example: 200,
    description: "Status code of the response",
  })
  status: HttpStatus;

  @ApiProperty({
    example: "Data deleted successfully",
    description: "Message of the response",
  })
  message: string;
}
