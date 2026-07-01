import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";

const app=express();
const port=5000;

app.use(cors());
app.use(express.json());


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
})

app.post("/upload-chunk", (req, res) => {
    console.log(`Received chunk ${req.body.chunkOrder}`);
    res.send({message:"Chunk received and saved successfully!"});
    
})

app.get("/", (req, res) =>{
    console.log("Hello");
})

app.listen(port, ()=>{
    console.log(`Server running on port: ${port}`)
})