import { Transform } from 'class-transformer';
import { IsInt, IsString, MaxLength } from 'class-validator';

export class CreateGameDto {
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  dolar: number;

  @Transform(({ value }) => parseInt(value))
  @IsInt()
  royalFlushFee: number;

  @IsString()
  @MaxLength(36)
  pixKey: string;

  @IsString()
  @MaxLength(40)
  pixName: string;
}
