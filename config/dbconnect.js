import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config()
const sequelize = new Sequelize({
  database: process.env.DBNAME,
  username: process.env.DBUSER,
  password: process.env.DBPASS,
  host: process.env.DBHOST,
  port: 5432,
  dialect: "postgres",
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

  sequelize.authenticate().then(() => {
   console.log('Connection has been established successfully.');
}).catch((error) => {
   console.error('Unable to connect to the database: ', error);
});

export default sequelize;
