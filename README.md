<<<<<<< HEAD
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
=======
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
>>>>>>> 78ea17157378277ba5b7ae42644841f479fc27f0
