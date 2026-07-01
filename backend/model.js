import mongoose from "mongoose";

// Blueprint for the master file
const FileSchema = new mongoose.Schema({
    originalName:String,
    fileHash:String,  // A uniue id
    totalChunks:Number,
    createdAt:{
        type:Date,
        default:Date.now
    }
});

// Blueprint for the individual pieces
const ChunkSchema= new mongoose.Schema({
    fileHash:String, // which master file it belongs to
    chunkOrder:Number,
    storagePath:String
});

export const FileMeta = mongoose.model('FileMeta', FileSchema);
export const ChunkMeta = mongoose.model('ChunkMeta', ChunkSchema);

