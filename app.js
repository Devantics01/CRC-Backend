import express from 'express';
import dotenv from 'dotenv';
import studentRoute from './routes/studentRoute.js';
import lecturerRoute from './routes/lecturerRoute.js';
import tokenRoute from './routes/tokenRoute.js';
import otpRoute from './routes/otpRoute.js';
import hodRoutes from './routes/hodRoutes.js';
import courseRoutes from './routes/courseRoute.js';
import cors from 'cors';

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
app.use('/hod', hodRoutes);
app.use('/course', courseRoutes);

app.use(cors({
    origin: ["http://localhost:5173", "https://crc-backend-vm4p.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.listen(port, ()=>{
    console.log(`server running at on port ${port}`);
});
