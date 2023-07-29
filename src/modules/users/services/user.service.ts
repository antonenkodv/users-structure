import { User } from '../../../core/models/users/user.model';
import { USER_REPOSITORY } from '../../../core/constants';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { SignUpDto } from '../../auth/dtos/sign.up.dto';
import { NotFoundError } from 'rxjs';
import sequelize from 'sequelize';

@Injectable()
export class UserService {
    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: typeof User) {}

    create(user: SignUpDto): Promise<User> {
        return this.userRepository.create<User>(user);
    }

    findOneByEmail(email: string): Promise<User> {
        return this.userRepository.findOne<User>({ where: { email } });
    }

    findOneById(id: string): Promise<User> {
        return this.userRepository.findOne<User>({ where: { id } });
    }

    updateById(userId: string, data: any) {
        return this.userRepository.update<User>(data, { where: { id: userId }, returning: true });
    }

    async changeBoss(user: User, subordinateId: string, bossId: string): Promise<boolean> {
        const isSubordinate = user.subordinates.some((sub) => sub === subordinateId);
        if (!isSubordinate)
            throw new ForbiddenException('Only boss can change for another boss and only for his subordinates');

        const boss = await this.findOneById(bossId);
        if (!boss) throw new NotFoundError('Boss not found');

        const promises = [
            this.updateById(subordinateId, { bossId }),
            this.updateById(user.id, {
                subordinates: sequelize.fn('array_remove', sequelize.col('subordinates'), subordinateId),
            }),
            this.updateById(bossId, {
                subordinates: sequelize.fn('array_append', sequelize.col('subordinates'), subordinateId),
            }),
        ];

        await Promise.all(promises);
        return true;
    }

    async getUsers(userId: string, users: User[]): Promise<User[]> {
        const user = await this.findOneById(userId);

        const allUsers = [user];

        const promises = user.subordinates.map((subId) => this.getUsers(subId, users));
        const results = await Promise.all(promises);

        results.forEach((result) => allUsers.push(...result));

        return allUsers;
    }
}
