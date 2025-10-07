import express from 'express';
import dotenv from 'dotenv';
import studentRoute from './routes/studentRoute.js';
import lecturerRoute from './routes/lecturerRoute.js';
import tokenRoute from './routes/tokenRoute.js';
import eventRoute from './routes/eventRoutes.js';
import otpRoute from './routes/otpRoute.js';
import hodRoutes from './routes/hodRoutes.js';
import courseRoutes from './routes/courseRoute.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const port = process.env.PORT || 3004;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res)=>{
    res.send('welcome to CRC Backend :)');
})

app.use('/student', studentRoute);
app.use('/lecturer', lecturerRoute);
app.use('/token', tokenRoute);
app.use('/otp', otpRoute);
app.use('/event', eventRoute);
app.use('/hod', hodRoutes);
app.use('/course', courseRoutes);

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3001", "https://crc-backend-vm4p.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.listen(port, ()=>{
    console.log(`server running at on port ${port}`);
});
