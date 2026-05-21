import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from '../../database/entities/otp.entity';
import { OtpsService } from './otps.service';

@Module({
    imports: [TypeOrmModule.forFeature([Otp])],
    providers: [OtpsService],
    exports: [OtpsService],
})
export class OtpsModule {}
