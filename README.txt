# 🚀 Team Task Manager

A professional, full-stack project and task management application. Built with a modern **React + Vite** frontend and a robust **Node.js/Express** backend, this tool empowers teams to organize projects, assign tasks, and track progress seamlessly.

**🌍 Live Demo:** [https://team-task-managers-c3u2.vercel.app/login](https://team-task-managers-c3u2.vercel.app/login)

## ✨ Key Features

- **🔐 Secure Authentication:** JWT-based login and registration with encrypted passwords using `bcryptjs`.
- **👥 Role-Based Access Control (RBAC):** 
  - **Admin:** Can create projects, create/delete tasks, and assign tasks to any team member.
  - **Member:** Can view their assigned tasks and update task statuses via the Kanban board.
- **📋 Dynamic Kanban Board:** An interactive drag-and-drop interface for managing task statuses (`Pending`, `In Progress`, `Completed`).
- **📊 Analytics Dashboard:** At-a-glance metrics calculating total, pending, in-progress, completed, and overdue tasks.
- **🎨 Premium Glassmorphism UI:** A stunning, modern, and responsive interface featuring glass-like panels, vibrant gradients, and smooth micro-animations.
- **⚙️ Built-In Limits:** Enforces a maximum of 10 tasks to simulate a tier-based constraint and keep the demo clean.

## 🛠️ Tech Stack

**Frontend:**
- React 19 (via Vite)
- React Router DOM for routing
- Axios for API requests
- Context API for global state management
- Vanilla CSS with Glassmorphism design system
- Lucide React for modern iconography

**Backend:**
- Node.js & Express.js
- SQLite3 (via raw SQL) for lightweight, serverless database storage
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
   # This custom script installs dependencies for both the frontend (root) and the backend
   npm run install-all
   ```

3. **Start the development server:**
   ```bash
   # Starts both the Express backend (port 5001) and Vite frontend (port 5173) simultaneously
   npm run dev
   ```

4. **Access the application:**
   - Open your browser to `http://localhost:5173`

*(Note: The backend database is already seeded with 3 projects and 10 sample tasks so you can explore the app immediately!)*

## 🚀 Deployment Instructions

### Frontend (Vercel)
The repository is completely optimized for Vercel deployment out-of-the-box.
1. Connect your GitHub repository to Vercel.
2. Vercel will automatically detect **Vite** as the framework since the frontend configuration is in the root folder. No custom settings needed!
3. Add an Environment Variable in your Vercel project settings:
   - `VITE_API_URL` = `<your-live-backend-url>` (Once your backend is deployed)

### Backend (Render / Railway)
1. Deploy the repository as a Node.js Web Service on a platform like Render or Railway.
2. Set the **Root Directory** setting in your deployment platform to `backend`.
3. Add the following Environment Variables:
   - `PORT=5001`
   - `JWT_SECRET=your_secure_random_string`
*(Note: Because SQLite saves to a local file, any data added on the live site will be reset when the server restarts unless you attach a persistent Disk/Volume to your backend service).*