import sequelize from "../config/dbconnect.js";
import { DataTypes } from 'sequelize';

const hod = sequelize.define('hods', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
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
  coursesManaged: {
    type: DataTypes.JSON,
    allowNull: false
  },
  notesTaken: {
    type: DataTypes.JSON,
    allowNull: false
  },
  faculty: {
    type: DataTypes.STRING,
    allowNull: false
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

await hod.sync();

export default hod;