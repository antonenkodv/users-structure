'use strict';
const { DataTypes } = require('sequelize');
const { DataType } = require('sequelize-typescript');

module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable('Users', {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: DataTypes.ENUM('admin', 'boss', 'common'),
                allowNull: false,
            },
            subordinates: {
                type: DataTypes.ARRAY(DataType.STRING),
                allowNull: true,
                defaultValue: [],
            },
            bossId: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'Users',
                    key: 'id',
                },
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Users');
    },
};
