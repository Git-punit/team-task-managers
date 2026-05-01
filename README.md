# 🚀 TaskSync: Team Task Manager

A professional, full-stack project and task management application. Built with a modern **React + Vite** frontend and a robust **Node.js/Express** backend, this tool empowers teams to organize projects, assign tasks, and track progress seamlessly.

**🌍 Live Demo:** [https://team-task-managers-c3u2.vercel.app/](https://team-task-managers-c3u2.vercel.app/)  
**⚙️ Backend API:** [https://team-task-managers-4.onrender.com](https://team-task-managers-4.onrender.com)

## ✨ Key Features

- **🔐 Secure Authentication:** JWT-based login and registration with encrypted passwords using `bcryptjs`.
- **👥 Role-Based Access Control (RBAC):** 
  - **Admin:** Full global access. Can create projects, manage all tasks, and delete any task.
  - **Member:** Can view their assigned tasks, create new tasks (auto-assigned), and delete their own tasks.
- **📋 Dynamic Kanban Board:** An interactive drag-and-drop interface for managing task statuses (`Pending`, `In Progress`, `Completed`).
- **➕ Inline Quick-Add:** Create tasks instantly from the Kanban column headers without leaving the page. Includes Title, Description, and Due Date fields.
- **📊 Analytics Dashboard:** At-a-glance metrics calculating total, pending, in-progress, completed, and overdue tasks.
- **🎨 Premium Dark UI:** A stunning, "human-crafted" dark theme featuring **DM Sans** typography, charcoal surfaces, and vibrant orange accents.
- **⚙️ High Capacity:** Optimized backend that supports up to **100 tasks** simultaneously.

## 🛠️ Tech Stack

**Frontend:**
- React 19 (via Vite)
- React Router DOM for routing
- Axios for API requests
- Context API for global state management
- Vanilla CSS with a custom modern design system
- Lucide React for modern iconography

**Backend:**
- Node.js & Express.js
- SQLite3 for lightweight, relational data storage
- JSON Web Tokens (JWT) for secure session management
- CORS and dotenv for environment configuration

## 📂 Project Structure

This project uses a modern, unified repository structure for easy deployment:
- **`/` (Root):** Contains the React frontend codebase, `vite.config.js`, and Vercel configuration.
- **`/backend`:** Contains the Node.js Express server, SQLite database, and API logic.

## 💻 Local Setup & Installation

Running this project locally is incredibly easy. Both the frontend and backend can be started together with a single command.

1. **Clone the repository:**
   ```bash
   git clone <your-github-repo-url>
   cd team-task-managers
   ```

2. **Install all dependencies:**
   ```bash
   # Installs dependencies for both the frontend (root) and the backend
   npm run install-all
   ```

3. **Start the development server:**
   ```bash
   # Starts the Express backend (port 8080) and Vite frontend (port 5173)
   npm run dev
   ```

4. **Access the application:**
   - Open your browser to `http://localhost:5173`

---

## 🚀 Deployment Instructions

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel.
2. Vercel will automatically detect **Vite** as the framework.
3. Add an Environment Variable in Vercel settings:
   - `VITE_API_URL` = `https://team-task-managers-4.onrender.com`

### Backend (Render / Railway)
1. Deploy the repository as a Node.js Web Service.
2. Set the **Root Directory** to `backend`.
3. Add the following Environment Variables:
   - `JWT_SECRET` = `your_secure_random_string`
   - `PORT` = `8080`
   - `NODE_VERSION` = `20`
4. Set the **Build Command** to `npm install` and the **Start Command** to `node index.js`.