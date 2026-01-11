# 📢 Notice Management System

A modern, full-stack Notice Management Dashboard designed for efficient communication. It features a fully responsive interface, optimized for both desktop and mobile users.

---

## 🌐 Submission Links
* **Live Frontend:** 
* **Live Backend:** https://nebs-it-task.vercel.app/
* **GitHub Repository:** https://github.com/hashemm621/nebs-it-task

---

## 📖 Project Overview
The Notice Management System is a streamlined platform for managing official announcements. It features a sophisticated dashboard with two distinct viewing modes: a detailed table view for desktop and a modern card-based layout for mobile devices. 

Key functionalities include real-time status toggling, integrated modals for viewing and editing, and a robust search/filter capability to manage large volumes of data.

---

## 🛠 Tech Stack
| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS, DaisyUI |
| **Icons** | Lucide React |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **State/Data** | Fetch API / Axios |

---

## 🚀 Installation Steps

Follow these steps to set up the project locally:

## 1. Clone the Repository
```bash
git clone [https://github.com/hashemm621/nebs-it-task.git](https://github.com/hashemm621/nebs-it-task.git)
cd your-repo-name 
```

## 2. Setup Backend
```bash
cd serverSite
npm install
nodemon index.js

cd ../clientSite
npm install
npm run dev
```
## Backend .env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
DB_NAME=noticeDB


### 📱 Key Features
Dynamic CRUD: Complete lifecycle management for notices (Create, Read, Update, Delete).

Responsive Layouts: * Desktop: Clean Table Layout with action dropdowns.

Mobile: Intuitive Card View for small screens.

Instant Status Toggle: Change notice status (Published/Draft) with immediate UI feedback.

Optimized Modals: High-performance modals for viewing and editing data without page refreshes.

Hydration Error Fixed: Fully optimized DOM nesting for React stability.

