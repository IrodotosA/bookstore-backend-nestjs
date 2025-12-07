import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  @MinLength(5)
  message: string;
}
