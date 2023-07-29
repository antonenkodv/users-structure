import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
    @ApiProperty({ description: 'User email', example: 'example@gmail.com', required: true })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ description: 'User password', example: '123456qwerty', required: true })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    readonly password: string;
}
