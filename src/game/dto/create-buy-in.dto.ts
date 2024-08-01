import { Transform } from "class-transformer";
import { IsInt } from "class-validator";

export class CreateBuyInDto {
  @Transform(({value}) => parseInt(value))
  @IsInt()
  playerId: number;

  @Transform(({value}) => parseInt(value))
  @IsInt()
  chips: number;
}
