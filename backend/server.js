import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import connectDB from "./config/connectDB.js";
import router from "./routes/restaurantRoutes.js";

const port = 4000;
const app = express();
app.use(express.json());
connectDB();

const allowedOrigins = ['http://localhost:5173','https://restaurant-finder-tl1g.onrender.com']
app.use(cors({origin: allowedOrigins, credentials: true}));

app.get('/',(req, res)=> res.send("api working"));

app.use('/api',router);
app.listen(port, ()=> {
    console.log("Listening on port 4000")
})