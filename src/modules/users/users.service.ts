import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import * as bcrypt from 'bcrypt';

type CreateUserDto = {
    national_id: string;
    phone: string;
    email?: string;
    password_hash?: string;
    first_name?: string;
    last_name?: string;
    status?: string;
    is_profile_completed?: boolean;
};

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { email },
        });
    }

    async findByNationalId(nationalId: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { national_id: nationalId },
        });
    }

    async findByPhone(phone: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { phone },
        });
    }

    async findById(userId: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { user_id: userId },
        });
    }

    async create(userData: CreateUserDto): Promise<User> {
        const user = this.usersRepository.create(userData);
        return this.usersRepository.save(user);
    }

    async completeProfile(userId: string, userData: {
        email?: string;
        first_name: string;
        last_name: string;
        phone?: string;
    }): Promise<void> {
        await this.usersRepository.update(
            { user_id: userId },
            {
                email: userData.email,
                first_name: userData.first_name,
                last_name: userData.last_name,
                phone: userData.phone,
                is_profile_completed: true,
                status: 'active',
            },
        );
    }

    async updateLastLogin(userId: string): Promise<void> {
        await this.usersRepository.update(
            { user_id: userId },
            { last_login: new Date() },
        );
    }

    async updateLastPasswordChange(userId: string): Promise<void> {
        await this.usersRepository.update(
            { user_id: userId },
            { last_password_change: new Date() },
        );
    }

    async updatePassword(userId: string, newPassword: string): Promise<void> {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.usersRepository.update(
            { user_id: userId },
            {
                password_hash: hashedPassword,
                last_password_change: new Date(),
            },
        );
    }

    async verifyEmail(userId: string): Promise<void> {
        await this.usersRepository.update(
            { user_id: userId },
            { is_email_verified: true },
        );
    }

    async enableTwoFactor(
        userId: string,
        method: 'email' | 'sms' | 'authenticator',
    ): Promise<void> {
        await this.usersRepository.update(
            { user_id: userId },
            {
                two_factor_enabled: true,
                two_factor_method: method,
            },
        );
    }

    async disableTwoFactor(userId: string): Promise<void> {
        await this.usersRepository.update(
            { user_id: userId },
            {
                two_factor_enabled: false,
                two_factor_method: null,
            },
        );
    }

    async deactivateUser(userId: string): Promise<void> {
        await this.usersRepository.update(
            { user_id: userId },
            { status: 'inactive' },
        );
    }

    async activateUser(userId: string): Promise<void> {
        await this.usersRepository.update(
            { user_id: userId },
            { status: 'active' },
        );
    }
}
