import sequelize from "../config/dbconnect.js";
import { DataTypes } from "sequelize";

const token = sequelize.define('tokens', {
    token_data: {
        type: DataTypes.STRING(1000),
        unique: true,
        allowNull: false
    }
});

await token.sync();

export default token; 