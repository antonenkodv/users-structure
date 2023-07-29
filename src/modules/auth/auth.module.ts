import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UserModule } from '../users/user.module';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtProvider } from '../../core/plugins/jwt/jwt.provider';

const providers = [AuthService, LocalStrategy, JwtStrategy];

@Module({
    imports: [PassportModule, UserModule, JwtProvider],
    providers: [...providers],
    controllers: [AuthController],
})
export class AuthModule {}
