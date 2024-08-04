import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsNotEmpty({ message: 'Name field must be fulfiled' })
  @MaxLength(50, {
    message: 'The name must be shorter than or equal to 50 characters',
  })
  @MinLength(2, { message: 'The name must be at least 2 characters long' })
  name: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'The password must be at least 6 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;
}
