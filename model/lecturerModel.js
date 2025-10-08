import sequelize from "../config/dbconnect.js";
import { DataTypes } from 'sequelize';

const lecturer = sequelize.define('lecturers', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false
  },
  acctStatus: {
    type: DataTypes.STRING,
    allowNull: false
  },
  levelsTaught: {
    type: DataTypes.JSON,
    allowNull: false
  },
  hodApproval: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

await lecturer.sync();

export default lecturer;