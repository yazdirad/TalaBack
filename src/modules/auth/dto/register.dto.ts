import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'Email address',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'SecurePass123!',
        description: 'Password (min 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special char)',
    })
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
        message: 'Password must contain uppercase, lowercase, number and special character',
    })
    password: string;

    @ApiProperty({
        example: 'John',
        description: 'First name',
    })
    @IsString()
    @MaxLength(100)
    first_name: string;

    @ApiProperty({
        example: 'Doe',
        description: 'Last name',
    })
    @IsString()
    @MaxLength(100)
    last_name: string;

    @ApiProperty({
        example: '+989123456789',
        description: 'Phone number (optional)',
        required: false,
    })
    @IsString()
    @MaxLength(20)
    phone?: string;
}
