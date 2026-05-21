import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Otp } from '../../database/entities/otp.entity';

@Injectable()
export class OtpsService {
    constructor(
        @InjectRepository(Otp)
        private otpRepository: Repository<Otp>,
    ) {}

    async sendOtp(
        nationalId: string,
        phone: string,
        userId?: string,
    ): Promise<{ code: string; expiresAt: Date }> {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        const otp = this.otpRepository.create({
            national_id: nationalId,
            phone,
            code,
            user_id: userId,
            expires_at: expiresAt,
            is_used: false,
        });

        await this.otpRepository.save(otp);

        // TODO: replace with real SMS gateway
        console.log(`OTP for ${nationalId}/${phone}: ${code}`);

        return { code, expiresAt };
    }

    async validateOtp(
        nationalId: string,
        phone: string,
        code: string,
    ): Promise<boolean> {
        const otp = await this.otpRepository.findOne({
            where: {
                national_id: nationalId,
                phone,
                code,
                is_used: false,
            },
            order: { created_at: 'DESC' },
        });

        if (!otp) {
            throw new BadRequestException('Invalid OTP');
        }

        if (otp.expires_at < new Date()) {
            throw new BadRequestException('OTP has expired');
        }

        otp.is_used = true;
        await this.otpRepository.save(otp);
        return true;
    }
}
