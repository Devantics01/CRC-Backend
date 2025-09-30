import sequelize from "../config/dbconnect.js";
import { DataTypes } from 'sequelize';

const student = sequelize.define('students', {
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
  calenderEvents: {
    type: DataTypes.JSON,
    allowNull: true
  },
  level: {
    type: DataTypes.STRING,
    allowNull: false
  },
  registeredCourses: {
    type: DataTypes.JSON,
    allowNull: true
  },
  matricNumber: {
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
  }
});

await student.sync();

export default student;