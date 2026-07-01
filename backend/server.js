import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { mergeChunks, uploadChunk } from "./fileController.js";

dotenv.config();

const app=express();
const port=5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Database connnection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.log("Database connection error: ", err))


// Create an 'uploads' folder on your computer if it doesn't already exist
const UPLOAD_DIR="./uploads";
if(!fs.existsSync(UPLOAD_DIR))
    fs.mkdirSync(UPLOAD_DIR);

// Setting up multer
const storage= multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const {fileHash, chunkOrder} =req.body;
        cb(null, `${fileHash}_${chunkOrder}.part`);
    }
});

const upload = multer({storage});

// Routes
app.post("/upload-chunk", upload.single('chunk'), uploadChunk);
app.post("/merge-chunk", mergeChunks);


app.listen(port, ()=>{
    console.log(`Server running on port: ${port}`)
})