import { IsNotEmpty } from "class-validator";

export class CreateConnectionDto {
  @IsNotEmpty()
  sourceId: string;

  @IsNotEmpty()
  destinationId: string;
}

export class UpdateConnectionDto {
  @IsNotEmpty()
  active: boolean;
}
