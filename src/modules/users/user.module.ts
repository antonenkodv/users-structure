import { Module } from '@nestjs/common';
import { UsersProviders } from '../../core/models/users/user.provider';
import { UserService } from './services/user.service';
import { UsersController } from './controllers/user.controller';

const providers = [UserService, ...UsersProviders];
const controllers = [UsersController];

@Module({
    controllers: [...controllers],
    providers: [...providers],
    exports: [UserService],
})
export class UserModule {}
