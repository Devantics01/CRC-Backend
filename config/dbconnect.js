import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config()
const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSERNAME, process.env.DBPASS,
  {
    dialect: 'postgres',
    host: process.env.DBHOST,
    port: 5432,
    ssl: true
  }
  );

  sequelize.authenticate().then(() => {
   console.log('Connection has been established successfully.');
}).catch((error) => {
   console.error('Unable to connect to the database: ', error);
});

export default sequelize;
