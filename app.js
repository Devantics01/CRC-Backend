import express from 'express';
import dotenv from 'dotenv';
import studentRoute from './routes/studentRoute.js';
import lecturerRoute from './routes/lecturerRoute.js';
import tokenRoute from './routes/tokenRoute.js';
import otpRoute from './routes/otpRoute.js';

dotenv.config();
const port = process.env.PORT || 3004;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res)=>{
    res.send('welcome to CRC Backend :)');
})

app.use('/student', studentRoute);
app.use('/lecturer', lecturerRoute);
app.use('/token', tokenRoute);
app.use('/otp', otpRoute);

app.listen(port, ()=>{
    console.log(`server running at on port ${port}`);
});
