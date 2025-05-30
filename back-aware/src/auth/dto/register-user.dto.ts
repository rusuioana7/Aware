import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(10, { message: 'Password must be at least 10 characters' })
  password!: string;

  @IsString({ message: 'Confirm password must be a string' })
  @MinLength(10, { message: 'Confirm password must be at least 10 characters' })
  confirmPassword!: string;
}
