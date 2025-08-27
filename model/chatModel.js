import sequelize from "../config/dbconnect.js";
import { DataTypes } from 'sequelize';

const chat = sequelize.define('chats', {
    chatID: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    personOne: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    personTwo: {
        type: DataTypes.JSON,
        allowNull: false
    },
    chats: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

await chat.sync();
export default chat;

