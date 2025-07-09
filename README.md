# 🚀 Real-Time Collaborative Kanban Board (Dockerized MERN + Socket.IO)

Welcome to your **production-ready, real-time collaborative Kanban board** — inspired by tools like Trello/Jira and fully built with the **MERN stack**, **Socket.IO** for live sync, and **Docker** for easy deployment anywhere.

---

## 📌 Project Overview

✅ **Register & login securely**
✅ **Create, edit, drag, and delete tasks** on a Kanban-style board (*Todo, In Progress, Done*)
✅ **Real-time updates** with Socket.IO — see changes instantly
✅ **Smart Assign:** auto-assigns tasks to the user with the fewest active tasks
✅ **Conflict Handling:** detects and resolves concurrent edits with user-friendly modals
✅ **Activity Log:** displays the last 20 actions for accountability
✅ **Fully containerized:** simple `docker-compose up` & down

---

## 🛠️ Tech Stack

| Layer            | Tech Used                           |
| ---------------- | ----------------------------------- |
| Frontend         | React, Socket.IO client, Axios      |
| Backend          | Node.js, Express.js, Socket.IO      |
| Database         | MongoDB (Docker container)          |
| Auth             | JWT + bcrypt                        |
| Containerization | Docker, Docker Compose              |
| Deployment       | Railway for both frontend & backend |

---

## 🐳 Dockerized Architecture

Runs as **three Docker containers**:

* **MongoDB:** local database with volume persistence
* **Backend API:** Node.js + Express + Socket.IO
* **Frontend:** React app

> ✅ No complex local setup — clone, configure `.env`, and run `docker-compose up`.

---

## ⚙️ Local Setup & Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Tanishqsingh288/Realtime-Kanban-Board.git
cd Realtime-Kanban-Board
```

### 2️⃣ Add Your Environment Variables

Create a `.env` file inside your backend folder:

```env
MONGO_URI=mongodb://mongo:27017/LiveCommonBoard
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

### 3️⃣ Run with Docker Compose

```bash
docker-compose up --build
```

* MongoDB: runs on container only
* Backend API: [http://localhost:5000](http://localhost:5000)
* Frontend: [http://localhost:3000](http://localhost:3000)

Visit your board at [http://localhost:3000](http://localhost:3000) ✨

---

## ✅ Key Features & Logic

### Smart Assign

When you click **Smart Assign**:

* Backend checks all tasks with status Todo/In Progress
* Groups tasks by user, counts active ones
* Assigns to the user with the fewest tasks
* Broadcasts the update to all connected clients in real-time.

### Conflict Handling

Each task has a `lastModified` timestamp:

* If two users edit the same task concurrently → backend detects mismatch → sends both versions back.
* User sees a modal with both versions to merge or overwrite.

---

## 🔗 Live Deployment

| Layer      | URL                                                                                                                                |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Live URL**   | [https://accomplished-inspiration-production-3e58.up.railway.app](https://accomplished-inspiration-production-3e58.up.railway.app) |
| Backend    | [https://realtime-kanban-board-production.up.railway.app](https://realtime-kanban-board-production.up.railway.app)                 |
| Demo Video | *Add your demo video link here*                                                                                                    |

---

## 📄 Additional Resources

✅ **[Logic\_Document.md](https://github.com/Tanishqsingh288/Realtime-Kanban-Board/blob/main/Logic_Doc.md)** — clear explanation of Smart Assign & Conflict Handling.
✅ **Demo Video** — shows login, real-time sync, Smart Assign, conflict handling.

---

## 🙌 Author

Built with ❤️ by **Tanishq Singh**
[GitHub](https://github.com/Tanishqsingh288/Realtime-Kanban-Board) · [LinkedIn](https://www.linkedin.com/in/tanishq-singh-3249b135b/)

## 📝 License

Open source under [MIT License](LICENSE).

---

## ⚡ Quick Start for Reviewers

✅ Clone → ✅ Add `.env` → ✅ `docker-compose up` → ✅ Visit `localhost:3000` → ✅ Test real-time sync.

Enjoy your **real-time collaborative Kanban board**! 🗂️🚀✨
