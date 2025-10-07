import sequelize from "../config/dbconnect.js";
import { DataTypes } from "sequelize";


const event = sequelize.define('events', {
    eventName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    eventID: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    eventDescription: {
        type: DataTypes.STRING,
        allowNull: false
    },
    eventDate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    eventMonth: {
        type: DataTypes.STRING,
        allowNull: false
    },
    visibility: {
        type: DataTypes.STRING,
        allowNull: false
    },
    eventOwner: {
        type: DataTypes.STRING,
        allowNull: false
    },
    eventTime: {
        type: DataTypes.STRING,
        allowNull: false
    },
    eventLocation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    eventStatus: {
        type: DataTypes.STRING,
        allowNull: false
    }
});


await event.sync();
export default event;