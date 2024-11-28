import {
  IsEmail,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @MinLength(3)
  @MaxLength(35)
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
