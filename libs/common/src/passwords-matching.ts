import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { RegisterDto } from 'src/auth/dto';

@ValidatorConstraint({ name: 'IsPasswordsMatching', async: false })
export class PasswordsMatching implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments) {
    const user = args.object as RegisterDto;
    return confirmPassword === user.password;
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    console.log(validationArguments);
    return 'Passwords do not match';
  }
}
