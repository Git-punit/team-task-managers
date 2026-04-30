# Team Task Manager

A full-stack project tracking and task management web application built with a modern React frontend and Node.js/Express backend.

## 🚀 Features
- **Authentication:** Secure JWT-based Login and Signup.
- **Role-Based Access Control:** `Admin` and `Member` roles. Admins can create projects and assign tasks, Members can view assigned tasks and change task statuses.
- **Projects Management:** Admins can create and view projects.
- **Task Management (Kanban Board):** Create tasks, assign them to members, and manage their status via a dynamic Drag-and-Drop Kanban Board.
- **Dashboard:** At-a-glance metrics covering total tasks, pending, in-progress, completed, and overdue tasks.
- **Glassmorphism UI:** Premium modern design using CSS and lucide-react icons.

## ⚙️ Tech Stack
- **Frontend:** React, Vite, React Router, Axios, Lucide React
- **Backend:** Node.js, Express, SQLite (Raw SQL via `sqlite`/`sqlite3`), JWT, bcryptjs

## 💻 Local Setup

1. **Clone the repository** (or download the source code).
2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   node index.js
   ```
   *The backend will run on `http://localhost:5000`. An SQLite database will automatically be initialized.*

3. **Setup Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *The frontend will be accessible at `http://localhost:5173`.*

## 🌐 Deployment on Railway

To deploy this app on Railway (as per your requirements):

1. **Push your code to a GitHub repository.** Ensure your root folder contains both `frontend` and `backend` directories.
2. **Deploy Backend:**
   - Go to [Railway.app](https://railway.app/).
   - Click **New Project** > **Deploy from GitHub repo**.
   - Select your repository.
   - Go to your backend service settings in Railway:
     - Under **Settings > Root Directory**, type `/backend`.
     - Go to **Variables** and add: `PORT=5000`, `JWT_SECRET=your_secure_secret_here`.
     - *Note: Railway has ephemeral storage by default. To make SQLite persistent, you must attach a **Volume** to your backend service in Railway and configure the DB path accordingly, or migrate to PostgreSQL.*
3. **Deploy Frontend:**
   - Click **New Service** > **Deploy from GitHub repo** and select your repo again.
   - Go to the new service settings:
     - Under **Settings > Root Directory**, type `/frontend`.
     - Ensure the build command is `npm run build` and start command is `npm run preview`.
     - Under **Variables**, add any environment variables if needed.
     - *Important: Update the Axios Base URL in your frontend codebase to match your deployed backend Railway URL instead of `http://localhost:5000`.*
4. **Generate Live URLs** for both services in the Networking tab on Railway.

## 📦 Submission

- **Live URL:** [Insert Railway Frontend URL Here]
- **GitHub Repo:** [Insert Repo Link Here]
- **Demo Video:** [Insert Link to 2-5 min Demo Video Here]
