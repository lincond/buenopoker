import { Transform } from "class-transformer";
import { IsInt } from "class-validator";

export class CreateGameDto {
  @Transform(({value}) => parseInt(value))
  @IsInt()
  dolar: number;

  @Transform(({value}) => parseInt(value))
  @IsInt()
  royalFlushFee: number;
}
