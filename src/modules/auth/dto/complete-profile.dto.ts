import { IsEmail, IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompleteProfileDto {
    @ApiProperty({ example: 'user@example.com', description: 'Email address' })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({ example: 'John', description: 'First name' })
    @IsString()
    @MaxLength(100)
    first_name: string;

    @ApiProperty({ example: 'Doe', description: 'Last name' })
    @IsString()
    @MaxLength(100)
    last_name: string;

    @ApiProperty({ example: '+989123456789', description: 'Phone number', required: false })
    @IsOptional()
    @IsString()
    phone?: string;
}
