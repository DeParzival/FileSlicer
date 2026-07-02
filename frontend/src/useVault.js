import { useState } from "react";

export function useVault(){

    // Upload state
    const [file, setFile] =useState(null);
    const [uploadStatus, setUploadStatus] = useState("Select a file to stash . . .");
    const [uploading, setUploading] = useState(false);
    const [generatedId, setGeneratedId] = useState("");
    const [copied, setCopied] = useState(false);

    // Retrieval state
    const [inputTrackingId, setInputTrackingId] = useState("");

    // Triggered when the user selects a file from the input field
    const handleFileChange = (e) =>{
        setFile(e.target.files[0]);
        setGeneratedId("");
    }

    // Main function for slicing the file and sending it to the server
    const uploadFile = async () => {
        if(!file)   return alert("Please select a file first");

        setUploading(true);

        const CHUNK_SIZE=1024*1024 // 1MB
        const totalChunks = Math.ceil(file.size/CHUNK_SIZE);
    

        const fileHash = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9]/g, "")}`;

        setUploadStatus(`Slicing file into ${totalChunks} chunks...`);

        try {
            for(let i=0;i<totalChunks;i++){
                const start=i*CHUNK_SIZE;
                const end = Math.min(start+CHUNK_SIZE, file.size);

                const chunk = file.slice(start, end);

                const formData = new FormData();
                formData.append('fileHash', fileHash);
                formData.append('chunkOrder', i);
                formData.append('chunk', chunk);

                setUploadStatus(`Stashing chunk ${i + 1} of ${totalChunks}...`);

                // Send the chunk to the backend and wait for it to finish before sending the next one
                await fetch('http://localhost:5000/upload-chunk', {
                    method:'POST', 
                    body: formData
                });
            }

            setUploadStatus("Securing vault data...");

            const finalizeResponse = await fetch('http://localhost:5000/finalize-upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileHash, fileName: file.name, totalChunks })
            });

            const result = await finalizeResponse.json();
            setUploadStatus("Upload Successful");
            setGeneratedId(result.trackingId);

        } catch (error) {
            console.error(error);
            setUploadStatus("An error occurred during chunking.");
        } finally {
            setUploading(false); 
        };
    }

    const triggerDownload = () => {
        if(!inputTrackingId.trim()){
            alert("Please enter a valid tracking ID");
            return;
        }

        window.open(`http://localhost:5000/download/${inputTrackingId.trim()}`);
    };

    const copyToClipboard = async () => {
        if (!generatedId) return;
        try {
            await navigator.clipboard.writeText(generatedId);
            setCopied(true);
            // Reset the button text back to "Copy" after 2 seconds
            setTimeout(() => setCopied(false), 2000); 
        } catch (err) {
            console.error("Failed to copy tracking ID: ", err);
        }
    };

    return{
        file,
        uploadStatus,
        uploading,
        generatedId,
        inputTrackingId,
        setInputTrackingId,
        handleFileChange,
        uploadFile,
        triggerDownload,
        copied,
        copyToClipboard
    };
}