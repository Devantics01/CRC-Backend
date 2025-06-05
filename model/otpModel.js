import sequelize from "../config/dbconnect.js";
import { DataTypes } from "sequelize";

const otp = sequelize.define('otps', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    otp_code: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

await otp.sync();

export default otp; 