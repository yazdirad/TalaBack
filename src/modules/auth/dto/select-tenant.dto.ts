import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SelectTenantDto {
    @ApiProperty({ example: '5f8d0d55-0e10-4a7c-8a60-a8a5d3b4d123', description: 'Tenant ID' })
    @IsString()
    tenant_id: string;
}
