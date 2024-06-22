import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Matches } from "class-validator";

export class CreateSourceDto {
  @ApiProperty({
    description: "The name of the source",
    example: "source name",
  })
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]*$/)
  name: string;
}

export class UpdateSourceDto {
  @ApiProperty({
    description: "The name of the source",
    example: "source name",
  })
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]*$/)
  name: string;
}
