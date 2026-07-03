<div align="center">
  
  <p><b>Infinite, Free Cloud Storage Powered by Telegram</b></p>
  
  ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
  ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
  ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
  ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
  ![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)
</div>

---

## ⚠️ Disclaimer
**This project was built for educational purposes to explore data chunking, streams, and third-party API integration. Relying on Telegram as a primary data warehouse violates their intended use cases, and they may restrict bot tokens that abuse bandwidth. Do not use this for critical or sensitive data.**

---

## 💡 The Story Behind The Project
We all face storage issues, right? As a student, it's difficult to justify paying monthly subscriptions for premium cloud storage providers when you're just trying to stash your study materials, projects, and massive files safely. 

The desperation (and curiosity) of a broke engineering student kicked in, and I realized a beautiful loophole: **Telegram offers unlimited cloud storage for free.** Is it a bit of a gray area? Probably. But the technical challenge of building a fully-functional, serverless file chunking engine got the better of me. Thus, this project was born—a way to bypass storage limits by slicing massive files into manageable chunks and stashing them in plain sight on Telegram's servers. Everyone likes free things, so why not build the ultimate free vault?

---

## 🚀 How It Works (The Slicer & Assembler)
Standard Telegram bots have a strict **20MB upload limit** per file. This app circumvents that limitation using a dynamic chunking architecture:

1. **🔪 The Slicer (Frontend):** You drop a file (no matter how large) into the UI. The React frontend slices it mathematically into optimal 19MB chunks.
2. **📡 The Relay (Backend):** Express receives these chunks sequentially and immediately streams them to a private Telegram channel using the Telegram Bot API. Local disk space is instantly wiped.
3. **📒 The Ledger (Database):** MongoDB records the unique Telegram `file_id` for every chunk, logging their precise order, and ties them to a master **Tracking ID**.
4. **🧩 The Assembler (Retrieval):** When you paste your Tracking ID, the backend fetches all the encrypted chunks from Telegram's CDN, stitches them back together in the correct order, and streams the original file straight to your browser.

---

## 🛠️ Tech Stack
### Frontend
* **React & Vite:** Lightning-fast UI rendering.
* **Axios:** Handles heavy-duty multipart form data uploads and intercepts blob streams.


### Backend
* **Node.js & Express.js:** The core API server routing the data pipelines.
* **Multer:** Intercepts incoming file chunks from the frontend.
* **Node-Telegram-Bot-API:** The bridge to our "cloud storage" provider.
* **Mongoose (MongoDB):** The ledger system to track file hashes, chunk orders, and Telegram file IDs.

---

## 🔐 Environment Variables

To run this project, you will need to create a `.env` file in your `backend` directory and add the following parameters:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | The port your Node server will run on | `5000` |
| `MONGO_URI` | Your MongoDB Atlas connection string | `mongodb+srv://<user>:<pass>@cluster...` |
| `TELEGRAM_BOT_TOKEN` | The token provided by [@BotFather](https://t.me/botfather) | `123456789:ABCdefGhIJKlmNoPQRstuVWXyz` |
| `TELEGRAM_CHANNEL_ID` | The ID of your private storage channel | `-1001234567890` |

---

## ⚙️ Local Setup & Installation

### 1. Prerequisites
* Node.js installed
* MongoDB installed (or a MongoDB Atlas URI)
* A Telegram Bot Token
* A private Telegram Channel (Add your bot as an admin so it can post files)

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev