import { type } from "os";
import sequelize from "../config/dbconnect.js";
import { DataTypes } from 'sequelize';

const hod = sequelize.define('hods', {
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
    allowNull: false,
    unique: true
  },
  coursesManaged: {
    type: DataTypes.JSON,
    allowNull: true
  },
  faculty: {
    type: DataTypes.STRING,
    allowNull: false
  },
  academicYear: {
    type: DataTypes.STRING,
    allowNull: true
  },
  acctStatus: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  notifications: {
    type: DataTypes.JSON,
    allowNull: true
  }
});

await hod.sync();

export default hod;