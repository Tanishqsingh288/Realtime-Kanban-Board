# 🚀 Real-Time Collaborative To-Do Board (Dockerized MERN + Socket.IO)

Welcome! This is a **production-ready, real-time collaborative Kanban board** inspired by tools like Trello/Jira — fully built with the **MERN stack**, **Socket.IO** for live sync, and **Docker** for easy deployment on any machine.

---

## 📌 Project Overview

* **What it does:**
  ✅ Users can **register** & **log in** securely
  ✅ Create, edit, drag, and delete tasks on a **Kanban-style board** (Todo, In Progress, Done)
  ✅ **Real-time updates** with Socket.IO — see every change live
  ✅ **Smart Assign**: automatically assigns tasks to the user with the fewest active tasks
  ✅ **Conflict Handling**: detects and resolves concurrent edits
  ✅ **Activity Log**: shows last 20 actions for team accountability
  ✅ **Fully containerized** with **Docker Compose**

---

## 🛠️ Tech Stack

| Layer            | Tech Used                           |
| ---------------- | ----------------------------------- |
| Frontend         | React, Socket.IO client, Axios      |
| Backend          | Node.js, Express.js, Socket.IO      |
| Database         | MongoDB (Docker container)          |
| Auth             | JWT + bcrypt                        |
| Containerization | Docker, Docker Compose              |
| Deployment       | Vercel (frontend), Render (backend) |

---

## 🐳 Dockerized Architecture

The whole project runs as **three Docker containers**:

* **MongoDB**: runs a local database with volume persistence
* **Backend API**: Node.js + Express server
* **Frontend**: React app

> No complex local setup — just clone, configure `.env`, and run `docker-compose up`.

---

## ⚙️ Local Setup & Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Tanishqsingh288/Realtime-Kanban-Board.git
cd Realtime-Kanban-Board.git
```

---

### 2️⃣ Add Your Environment Variables

Create a `.env` file in your backend folder:

```env
MONGO_URI=mongodb://mongo:27017/LiveCommonBoard
JWT_SECRET=12345
CLIENT_URL=http://localhost:3000
```

---

### 3️⃣ Run with Docker Compose

```bash
docker-compose up --build
```

* MongoDB: [http://localhost:27017](http://localhost:27017) (via containers, no direct browser access)
* Backend API: [http://localhost:5000](http://localhost:5000)
* Frontend: [http://localhost:3000](http://localhost:3000)

Visit your **Kanban board** on [http://localhost:3000](http://localhost:3000) ✨

---

## ✅ Features & Usage

* **Secure Auth**: Register/Login with JWT token-based auth.
* **Kanban Board**: 3 columns, drag & drop tasks.
* **Smart Assign**: Click “Smart Assign” → task auto-assigned to the least busy user.
* **Conflict Handling**: If two users edit the same task, a modal shows both versions to merge or overwrite.
* **Activity Log**: See who did what, updated live via Socket.IO.
* **Dockerized**: Portable, works the same on any OS.

---

## 🤖 Smart Assign Logic (How it works)

When “Smart Assign” is clicked:

* Backend checks all tasks with status **Todo** or **In Progress**
* Groups tasks by user, counts active ones
* Assigns the task to the user with the **fewest tasks**
* Broadcasts the update to all connected clients in real-time.

---

## ⚔️ Conflict Handling Logic

Each task has a **lastModified** timestamp:

* If User A edits a task & User B edits the same task before A saves:

  * Backend compares timestamps → mismatch triggers **409 Conflict**
  * Both versions are sent to the client
  * A modal lets the user merge changes or overwrite.

---

## 🔗 Live Deployment

| Layer      | URL                                              |
| ---------- | ------------------------------------------------ |
| Frontend   | [Vercel Link](https://your-frontend.vercel.app)  |
| Backend    | [Render Link](https://your-backend.onrender.com) |
| Demo Video | [Watch Here](https://your-demo-video-link.com)   |

---

## 📄 Logic Document

Read `Logic_Document.md` in this repo for a 1-page explanation of Smart Assign & Conflict Handling — clear & ready for submission.

---

## 📸 Demo Video

Watch the full 5–10 min walkthrough here: [Demo Video](https://your-demo-video-link.com)
Includes:

* Project overview
* Live login/register
* Drag & drop tasks
* Real-time updates with multiple browsers
* Smart Assign demo
* Conflict handling in action

---

## 📝 License

Open source under [MIT License](LICENSE).

---

## 🙌 Author

Built with ❤️ by **Tanishq Singh**
[GitHub](https://github.com/YOUR_USERNAME) | [LinkedIn](https://linkedin.com/in/YOUR_LINKEDIN)

---

## ⚡ Quick Start for Reviewers

✅ Clone → ✅ Add `.env` → ✅ `docker-compose up` → ✅ Visit `localhost:3000` → ✅ Test real-time sync in multiple tabs.

Enjoy your **real-time collaborative Kanban board**! 🗂️🚀✨
