import sequelize from "../config/dbconnect.js";
import { DataTypes } from 'sequelize';

const student = sequelize.define('students', {
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
  level: {
    type: DataTypes.STRING,
    allowNull: false
  },
  program: {
    type: DataTypes.STRING,
    allowNull: false
  },
  registeredCourses: {
    type: DataTypes.JSON,
    allowNull: false
  },
  matricNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  acctStatus: {
    type: DataTypes.STRING,
    allowNull: false
  },
  academicYear: {
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