import { IsNotEmpty, Matches } from "class-validator";

export class CreateDestinationDto {
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]*$/)
  name: string;

  @IsNotEmpty()
  url: string;
}

export class UpdateDestinationDto {
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]*$/)
  name: string;

  @IsNotEmpty()
  url: string;
}
