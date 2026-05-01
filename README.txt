TASKSYNC: TEAM TASK MANAGER
============================

A professional, full-stack project and task management application. 
Built with a modern React + Vite frontend and a robust Node.js/Express backend.

LIVE DEMO:
----------
Frontend (Vercel): https://team-task-managers-c3u2.vercel.app/
Backend (Render): https://team-task-managers-4.onrender.com

KEY FEATURES:
-------------
- Secure Authentication: JWT-based login with bcrypt encryption.
- Role-Based Access: Admin (Full access) and Member (Restricted access).
- Dynamic Kanban Board: Interactive drag-and-drop status management.
- Inline Quick-Add: Create tasks instantly with Title, Description, and Date.
- Analytics Dashboard: Real-time productivity metrics.
- Premium Design: Custom dark theme with DM Sans typography and orange accents.
- Scalability: Support for up to 100 tasks.

TECH STACK:
-----------
- Frontend: React 19, React Router, Axios, Lucide Icons.
- Backend: Node.js, Express, SQLite3, JWT, CORS.

LOCAL SETUP:
------------
1. Clone the repository.
2. Run 'npm run install-all' to install all dependencies.
3. Run 'npm run dev' to start the app.
4. Access at http://localhost:5173

DEPLOYMENT:
-----------
- Frontend: Use Vercel, set VITE_API_URL to your Render backend URL.
- Backend: Use Render/Railway, set Root Directory to 'backend'.
  Add ENV vars: JWT_SECRET, PORT (8080), NODE_VERSION (20).
  Build Command: 'npm install'
  Start Command: 'node index.js'