# 📥 Tiktok Video Downloader

**Tiktok Video Downloader** is a sleek and efficient web application built using the **MERN stack** (MongoDB, Express, Nextjs, Nest.js) that allows users to download videos directly from Tiktok by simply pasting the video link. Styled beautifully with **Tailwind CSS**, it offers a seamless user experience with instant downloads and a modern interface.

---

## 🚀 Features
- 🔗 **Paste and Download:** Just paste the Tiktok video link and download it directly with a single click.
- ⚡ **Direct Download:** Videos download directly without navigating to another page.
- 🎨 **Beautiful UI:** Styled with **Tailwind CSS** for a clean and modern look.
- 🔄 **Loading Spinner:** Displays a smooth loading animation during the download process.
- 📂 **Automatic Folder Management:** Downloads are saved automatically in the server’s `downloads` folder.

---

## 💻 Tech Stack
- **Frontend:** nextjs, Axios, Tailwind CSS
- **Backend:** Nest.js, Express, Cheerio, Axios
- **Development Tools:** Nodemon for live reloading

---

## ⚙️ Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kakugb/TikoSave-Tiktok-Downloader.git
   cd TikoSave-Downloader

   cd backend
npm install
npm install nodemon -D
npm start  // or run with nodemon

cd ../frontend
npm install
npm start

🚧 Requirements
Node.js v14.x or above
MongoDB (Optional if planning to add user history or logs)


🔥 How It Works
Paste Link: User pastes the Tiktok video link.
Fetch and Extract: The backend scrapes the Tiktok page to extract the video URL.
Download and Serve: The video is downloaded on the server and served as a direct download to the user.
Direct Download: The frontend triggers the download without redirecting to another page.

🎨 UI Design and User Experience
Modern and responsive UI built using Tailwind CSS.
Clean input field for pasting Pinterest links.
Animated loading spinner for a smooth experience.
Direct download without showing extra messages.

🔒 Legal Disclaimer
This project is intended for educational purposes only. Downloading videos from Pinterest may violate their terms of service and copyright laws. Use responsibly.

🌟 Future Enhancements
🌐 Multiple Language Support
📂 Download History with MongoDB
⚡ Faster Downloads with Caching
🎥 Preview Video Before Downloading

🤝 Contributing
Feel free to contribute to this project by opening issues or pull requests. Contributions, issues, and feature requests are welcome!

Fork the Project
Create your Feature Branch (git checkout -b feature/AmazingFeature)
Commit your Changes (git commit -m 'Add some AmazingFeature')
Push to the Branch (git push origin feature/AmazingFeature)
Open a Pull Request


🧡 Support
If you like this project, please ⭐ star the repository and share it with others. Contributions, issues, and feature requests are welcome!

   
