import { PasswordsMatching } from '@app/common';
import { IsEmail, IsString, MinLength, Validate } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(6)
  @Validate(PasswordsMatching)
  passwordConfirmation: string;

  @IsString()
  name: string;
}
