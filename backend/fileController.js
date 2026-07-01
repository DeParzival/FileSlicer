import fs from "fs";
import { ChunkMeta, FileMeta } from "./model.js";


// Handles saving chunk details to the database ledger
export const uploadChunk = async (req, res) => {
    try {
        const {fileHash, chunkOrder} = req.body;
        const storagePath = req.file.path;  

        await ChunkMeta.create({
            fileHash:fileHash,
            chunkOrder: Number(chunkOrder),
            storagePath:storagePath
        });

        console.log(`Chunk ${chunkOrder} for file ${fileHash} saved to disk and database`);
        res.status(200).send({message:"Chunk saved successfully"});

    } catch (error) {
        console.error("Error saving chunk:", error);
        res.status(500).send({message: "Something went wrong saving the chunk"});
    }
};


// Gluing back the chunks
export const mergeChunks = async (req, res) => {
    const {fileHash, fileName, totalChunks}= req.body;

    try {
        // Find all pieces belonging to the file in order
        const chunks = await ChunkMeta.find({fileHash}).sort({chunkOrder:1});

        if(chunks.length!=Number(totalChunks))
            return res.status(400).send({message: "Missing chunks"});

        const filePath = `./uploads/${fileName}`;

        // Wipes any old duplicate files
        if(fs.existsSync(filePath))
            fs.unlinkSync(filePath);

        // Stitching the pieces back together
        for(const chunk of chunks){
            const chunkBuffer = fs.readFileSync(chunk.storagePath);
            fs.appendFileSync(filePath, chunkBuffer);

            fs.unlinkSync(chunk.storagePath);
        }

        // Add it to the master ledger
        await FileMeta.create({originalName:fileName, fileHash, totalChunks: Number(totalChunks)});

        // delete the chunks
        await ChunkMeta.deleteMany({fileHash});

        console.log(`Success! File securely merged into: ${fileName}`);
        res.status(200).send({message: "File reassembled", filePath: filePath});

    } catch (error) {
        console.log("Error during merging process: ", error);
        res.status(500).send({message:"Failed to merge chunks"});
        
    }

}