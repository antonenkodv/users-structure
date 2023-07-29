import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';

export enum UserRole {
    ADMIN = 'admin',
    BOSS = 'boss',
    REGULAR = 'regular',
}

export const UserRolePriority: Record<UserRole, number> = {
    [UserRole.ADMIN]: 3,
    [UserRole.BOSS]: 2,
    [UserRole.REGULAR]: 1,
};

@Table
export class User extends Model<User> {
    @Column({
        type: DataType.UUID,
        unique: true,
        allowNull: false,
        primaryKey: true,
    })
    id: string;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password: string;

    @Column({
        type: DataType.ENUM(...Object.values(UserRole)),
        allowNull: false,
    })
    role: UserRole;

    @Column({
        type: DataType.ARRAY(DataType.STRING),
        allowNull: true,
        defaultValue: [],
    })
    subordinates: string[];

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    bossId: string;

    @BelongsTo(() => User, 'bossId')
    boss: User;
}
