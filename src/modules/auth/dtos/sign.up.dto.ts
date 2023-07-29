import { IsNotEmpty, MinLength, IsEmail, IsEnum, IsUUID, IsOptional } from 'class-validator';
import { UserRole } from '../../../core/models/users/user.model';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
    @ApiProperty({ description: 'User email', example: 'example@gmail.com', required: true })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ description: 'User password', example: '123456qwerty', required: true })
    @IsNotEmpty()
    @MinLength(6)
    readonly password: string;

    @ApiProperty({ description: 'User password', enum: UserRole, example: UserRole.ADMIN, required: true })
    @IsEnum(UserRole)
    @IsNotEmpty()
    readonly role: UserRole;

    @ApiProperty({ description: 'Boss identifier', example: 'ae34c2b9-634e-4d89-8201-e8b20865782d', required: false })
    @IsOptional()
    @IsUUID()
    readonly bossId?: string;
}
