import { IsEmail, IsIn, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  fullName: string;

  @IsIn(['admin', 'staff', 'member'])
  role: 'admin' | 'staff' | 'member' = 'member';
}




