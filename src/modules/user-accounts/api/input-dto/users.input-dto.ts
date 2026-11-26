import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserInputDto {
  @IsString()
  @IsNotEmpty()
  login!: string;
  @IsString()
  @IsNotEmpty()
  password!: string;
  @IsEmail()
  email!: string;
}
