import sequelize from "../config/dbconnect.js";
import { DataTypes } from "sequelize";

const token = sequelize.define('tokens', {
    token_data: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
});

await token.sync();

export default token; 