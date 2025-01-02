import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js'
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import {app,server} from "./lib/socket.js"
dotenv.config();
const port = process.env.PORT || 5001;
import path from 'path';

const __dirname=path.resolve();

// Middleware
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true,//allow the cookie or autherization header to be sent with the request
}));

// Connect to Database
connectDB(); // Ensure DB connection before starting the server

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Home route handler
// app.get("/", (req, res) => {
//     res.send("Server is running-2");
// });
if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));
}

app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
})

// Start the server
server.listen(port, () => {
    console.log(`The server is running on: http://localhost:${port}`);
});
