import { IsString, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: '0071234567', description: 'کد ملی' })
    @IsString()
    national_id: string;

    @ApiProperty({ example: '+989123456789', description: 'شماره موبایل' })
    @IsString()
    phone: string;

    @ApiProperty({ example: 'Mozilla/5.0...', description: 'User agent (optional)', required: false })
    @IsOptional()
    @IsString()
    user_agent?: string;

    @ApiProperty({ example: '192.168.1.1', description: 'IP address (optional)', required: false })
    @IsOptional()
    @IsString()
    ip_address?: string;
}
