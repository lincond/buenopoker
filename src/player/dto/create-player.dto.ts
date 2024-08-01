import { IsString, MaxLength } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  @MaxLength(60)
  name: string;

  @IsString()
  @MaxLength(60)
  pix: string;
}
