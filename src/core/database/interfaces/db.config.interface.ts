import { ModelCtor } from 'sequelize-typescript';
import { Dialect } from 'sequelize/types/sequelize';

interface IDatabaseConfig {
    username: string;
    password: string;
    database: string;
    host: string;
    port: number;
    dialect: Dialect;
}
export interface ISequelizeConfig extends IDatabaseConfig {
    urlDatabase?: string;
    models: string[] | ModelCtor[];
    autoLoadModels?: boolean;
    synchronize?: boolean;
    define?: object;
}
