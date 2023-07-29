import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseProvider } from './core/database/database.provider';
import { AuthModule } from './modules/auth/auth.module';

@Module({
    imports: [DatabaseProvider, AuthModule, ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' })],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
