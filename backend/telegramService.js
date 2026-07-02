import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import fs, { write } from "fs";
import dotenv from "dotenv";

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling:false});
const chatId = process.env.TELEGRAM_CHANNEL_ID;

// the upload function
export const uploadToTelegram = async(filePath) => {
    try {
        // stream so we don't load the whole chunk into RAM
        //const fileStream = fs.createWriteStream(filePath);

        const message = await bot.sendDocument(chatId, filePath);

        // returns the unique file_id we need for downloading later
        return message.document.file_id

    } catch (error) {
        console.error("Telegram upload failed:", error);
        throw error;
    }
}

// download a file from telegram and store it in a specific local path
export const downloadFromTelegram = async (fileId, destinationPath) => {
    try {
        const fileLink = await bot.getFileLink(fileId);


        // download the file as a stream using axios
        const response = await axios({
            method:'GET',
            url:fileLink,
            responseType:'stream'
        });

        // Pipe the downloaded stream straight to our hard drive
        const writer = fs.createWriteStream(destinationPath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

    } catch (error) {
        console.error("Telegram download failed:", error);
        throw error;
    }
}