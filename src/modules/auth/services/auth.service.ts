import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../../users/services/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserRole, UserRolePriority } from '../../../core/models/users/user.model';
import * as uuid from 'uuid';
import { SignUpDto } from '../dtos/sign.up.dto';
import sequelize from 'sequelize';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

    async validateUser(username: string, pass: string): Promise<Omit<User, 'password'>> {
        const user = await this.userService.findOneByEmail(username);
        if (!user) {
            return null;
        }

        const match = await this.comparePassword(pass, user.password);
        if (!match) {
            return null;
        }

        const dataValues = user['dataValues'];
        delete dataValues.password;

        return dataValues;
    }

    public async signIn(user: User): Promise<{ user: User; token: string }> {
        const token = await this.generateToken(user);
        return { user, token };
    }

    public async signUp(userDto: SignUpDto): Promise<{ user: Omit<User, 'password'>; token: string }> {
        const pass = await this.hashPassword(userDto.password);

        const newUserData = {
            id: uuid.v4(),
            email: userDto.email,
            password: pass,
            role: userDto.role,
        };

        if (userDto.role !== UserRole.ADMIN) {
            if (!userDto.bossId) throw new ForbiddenException('Boss must be specified');

            const boss = await this.userService.findOneById(userDto.bossId);
            if (!boss) throw new NotFoundException('Boss not found');

            if (UserRolePriority[userDto.role] >= UserRolePriority[boss.role])
                throw new ForbiddenException('Unprocessible operation');
            newUserData['bossId'] = boss.id;

            await this.userService.updateById(boss.id, {
                subordinates: sequelize.fn('array_append', sequelize.col('subordinates'), newUserData.id),
            });
        }

        const newUser = await this.userService.create(newUserData);
        const { dataValues } = newUser;
        delete dataValues.password;

        const token = await this.generateToken(dataValues);

        return { user: dataValues, token };
    }

    private async generateToken(user: Omit<User, 'password'>): Promise<string> {
        const token = await this.jwtService.signAsync(user);
        return token;
    }

    private async hashPassword(password: string): Promise<string> {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }

    private async comparePassword(enteredPassword: string, dbPassword: string): Promise<boolean> {
        return bcrypt.compare(enteredPassword, dbPassword);
    }
}
