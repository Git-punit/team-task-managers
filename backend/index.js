require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'No token provided' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Admin access required' });
  next();
};

let db;
getDb().then(database => {
  db = database;
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existing) return res.status(400).json({ message: 'Email already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const assignedRole = role === 'Admin' ? 'Admin' : 'Member';
    const result = await db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, assignedRole]
    );
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Users Route
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await db.all('SELECT id, name, email, role FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Projects Routes
app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const projects = await db.all('SELECT * FROM projects');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/projects', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await db.run('INSERT INTO projects (name, description) VALUES (?, ?)', [name, description]);
    const newProject = await db.get('SELECT * FROM projects WHERE id = ?', [result.lastID]);
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Tasks Routes
app.get('/api/tasks', authenticateToken, async (req, res) => {
  try {
    let query = `
      SELECT t.*, p.name as projectName, u.name as assignedUserName 
      FROM tasks t 
      LEFT JOIN projects p ON t.projectId = p.id 
      LEFT JOIN users u ON t.assignedTo = u.id
    `;
    let params = [];
    if (req.user.role !== 'Admin') {
      query += ' WHERE t.assignedTo = ?';
      params.push(req.user.id);
    }
    const tasks = await db.all(query, params);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/tasks', authenticateToken, async (req, res) => {
  try {
    // Check if the maximum limit of 100 tasks has been reached
    const countResult = await db.get('SELECT COUNT(*) as count FROM tasks');
    if (countResult.count >= 100) {
      return res.status(400).json({ message: 'Maximum limit of 100 tasks reached.' });
    }

    const { title, description, projectId, dueDate } = req.body;
    // Admins can assign to anyone; Members are always self-assigned
    const assignedTo = req.user.role === 'Admin' && req.body.assignedTo
      ? req.body.assignedTo
      : req.user.id;

    const result = await db.run(
      'INSERT INTO tasks (title, description, projectId, assignedTo, dueDate, createdBy) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, projectId, assignedTo, dueDate, req.user.id]
    );
    const newTask = await db.get('SELECT * FROM tasks WHERE id = ?', [result.lastID]);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const task = await db.get('SELECT * FROM tasks WHERE id = ?', [id]);
    
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    // Non-admins can only update their own tasks
    if (req.user.role !== 'Admin' && task.assignedTo !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    await db.run('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/tasks/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await db.run('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Dashboard Analytics Route
app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    const taskQuery = req.user.role === 'Admin' ? 'SELECT * FROM tasks' : 'SELECT * FROM tasks WHERE assignedTo = ?';
    const params = req.user.role === 'Admin' ? [] : [req.user.id];
    
    const tasks = await db.all(taskQuery, params);
    
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === 'Pending').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    
    const today = new Date().toISOString();
    const overdue = tasks.filter(t => t.dueDate && t.dueDate < today && t.status !== 'Completed').length;
    
    res.json({
      total,
      pending,
      inProgress,
      completed,
      overdue
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


