import mongoose from "mongoose";

// Blueprint for the master file
const FileSchema = new mongoose.Schema({
    fileName:String,
    fileHash:String,  // A uniue id
    totalChunks:Number,
    status:String,
    createdAt:{
        type:Date,
        default:Date.now
    }
});

// Blueprint for the individual pieces
const ChunkSchema= new mongoose.Schema({
    fileHash:String, // which master file it belongs to
    chunkOrder:Number,
    telegramFieldId:String, // stores the id telegram gives us
    messageId:Number, // the exact message in the channel
});

export const FileMeta = mongoose.model('FileMeta', FileSchema);
export const ChunkMeta = mongoose.model('ChunkMeta', ChunkSchema);

