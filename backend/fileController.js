import fs from "fs";
import path from "path";
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

// checks the db to confirm all the pieces arrived, after confirming, it hands the user their unique tracking ID
export const finalizeUpload = async (req, res) => {
    try {
        const {fileHash, fileName, totalChunks} = req.body;

        // log the file configuration in db
        const newFile = await FileMeta.create({
            fileHash,
            fileName,
            totalChunks: Number(totalChunks),
            status: 'Ready for on-demand assembly'
        });

        // handing back the fileHash as the unique tracking ID
        res.status(201).json({
            message:"All pieces stashed successfully",
            trackingId:newFile.fileHash
        });

    } catch (error) {
        res.status(500).send({message:"Failed to finalize upload: ", error});
    }
}

// the merge engine
export const downloadFile = async (req, res) => {
    try {
        const {trackingId} = req.params;

        // Look up the file
        const fileRecord = await FileMeta.findOne({fileHash:trackingId});
        if(!fileRecord)
            return res.status(400).json({message:"Invalid tracking Id. File not found"});

        // Find all pieces belonging to the file in order
        const chunks = await ChunkMeta.find({fileHash:trackingId}).sort({chunkOrder:1});

        if(chunks.length!=Number(fileRecord.totalChunks))
            return res.status(400).send({message: "Missing chunks"});

        for (let i = 0; i < chunks.length; i++) {
        if (chunks[i].chunkOrder !== i) {
            return res.status(400).json({ 
                message: `File compilation aborted: Expected chunk index ${i}, but found ${chunks[i].chunkOrder}. Your pieces are corrupted.` 
            });
        }
}

        // temporary location to stitch the files together
        const tempMergedPath = path.resolve('uploads', `TEMP-${fileRecord._id}.tmp`);

        // Wipes any old duplicate files
        if(fs.existsSync(tempMergedPath))
            fs.unlinkSync(tempMergedPath);

        // Stitching the pieces back together
        for (const chunk of chunks) {
            const chunkData = fs.readFileSync(chunk.storagePath);
            fs.appendFileSync(tempMergedPath, chunkData);
        }

        res.download(tempMergedPath, fileRecord.fileName, { dotfiles: 'allow' }, (err) => {

            if(err)
                console.error("Download streaming failed:", err);
                

            if (fs.existsSync(tempMergedPath)) {
                fs.unlinkSync(tempMergedPath);
                console.log(`Temp workspace cleaned. Permanent chunks retained for ID: ${trackingId}`);
            }
        })

    } catch (error) {
        res.status(500).json({message:"Assembly failed", error:error.message});
    }
}