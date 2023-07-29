import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ISequelizeConfig } from './interfaces/db.config.interface';
import { Dialect } from 'sequelize/types/sequelize';
import { User } from '../models/users/user.model';

export const DatabaseProvider = SequelizeModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService): Promise<ISequelizeConfig> => {
        return {
            dialect: configService.get<string>('DB_DIALECT') as Dialect,
            host: configService.get<string>('DB_HOST'),
            port: configService.get<number>('DB_PORT'),
            username: configService.get<string>('DB_USER'),
            password: configService.get<string>('DB_PASS'),
            database: configService.get<string>('DB_NAME'),
            models: [User],
            synchronize: true,
            // autoLoadModels: true, // turn on for using local db
        };
    },
    inject: [ConfigService],
});
