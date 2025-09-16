import sequelize from "../config/dbconnect.js";
import { DataTypes } from 'sequelize';

const course = sequelize.define('courses', {
    course_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    course_code: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    department: {
        type: DataTypes.STRING,
        allowNull: false
    },
    level: {
        type: DataTypes.STRING,
        allowNull: false
    },
    course_description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    resource_link: {
        type: DataTypes.JSON,
        allowNull: true
    },
    assignments: {
        type: DataTypes.JSON,
        allowNull: true
    },
    resourceApproval: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

await course.sync();
export default course;