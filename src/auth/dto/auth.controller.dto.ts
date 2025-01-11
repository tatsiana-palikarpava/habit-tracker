import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Exclude } from 'class-transformer';

export class SignUpDto {
  @ApiProperty({ type: String })
  @IsString()
  public fullName: string;

  @ApiProperty({ type: String })
  @IsEmail()
  public email: string;

  @ApiProperty({ type: String })
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minSymbols: 1,
    minNumbers: 1,
  })
  public password: string;
}

export class SignInDto {
  @ApiProperty({ type: String })
  @IsEmail()
  public email: string;

  @ApiProperty({ type: String })
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minSymbols: 1,
    minNumbers: 1,
  })
  public password: string;
}

export class GetMeResponseDTO extends User {
  @ApiResponseProperty({ type: Number })
  id: number;

  @ApiResponseProperty({ type: String })
  fullName: string;

  @ApiResponseProperty({ type: String })
  email: string;

  @Exclude()
  password: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(data: Partial<User>) {
    super();
    Object.assign(this, data);
  }
}
