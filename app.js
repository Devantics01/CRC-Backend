import express from 'express';
import userRoutes from './routes/userRoutes.js';
import lecturerRoutes from './routes/lecturerRoutes.js';
import hodRoutes from './routes/hodRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import tokenRoutes from './routes/tokenRoutes.js';

import dotenv from 'dotenv';

const app = express();
const port = 3000;

dotenv.config();
app.use(express.json())
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res)=>{
  res.send('welcome to Courseware Cloud');
});

app.use('/student', userRoutes);
app.use('/lecturer', lecturerRoutes);
app.use('/hod', hodRoutes);
app.use('/course', courseRoutes);
app.use('/', tokenRoutes);

app.listen(3000, ()=>{
  console.log(`server running on http://localhost:${port}`);
});