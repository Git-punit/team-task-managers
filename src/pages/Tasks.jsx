import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { AuthContext } from '../context/AuthContext';
import { Plus, Clock, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { user } = useContext(AuthContext);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');

  const fetchData = async () => {
    try {
      const tasksRes = await axios.get(`${API_BASE_URL}/api/tasks`);
      setTasks(tasksRes.data);
      
      if (user?.role === 'Admin') {
        const [projRes, usersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/projects`),
          axios.get(`${API_BASE_URL}/api/users`)
        ]);
        setProjects(projRes.data);
        setUsers(usersRes.data);
        if (projRes.data.length > 0) setProjectId(projRes.data[0].id);
        if (usersRes.data.length > 0) setAssignedTo(usersRes.data[0].id);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/tasks`, {
        title, description, projectId, assignedTo, dueDate
      });
      toast.success('Task created successfully');
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setDueDate('');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating task');
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/api/tasks/${taskId}`, { status: newStatus });
      fetchData();
      toast.success('Task updated');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/tasks/${taskId}`);
      fetchData();
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  // Kanban Drag and Drop Logic
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e, status) => {
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      const task = tasks.find(t => t.id === parseInt(taskId));
      if (task && task.status !== status) {
        updateTaskStatus(taskId, status);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const renderTaskCard = (task) => (
    <div 
      key={task.id} 
      className="glass-panel kanban-card"
      draggable
      onDragStart={(e) => handleDragStart(e, task.id)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h4 style={{ fontSize: '1.05rem', margin: 0 }}>{task.title}</h4>
        {user?.role === 'Admin' && (
          <button 
            onClick={() => handleDeleteTask(task.id)}
            style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
            title="Delete task"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{task.description}</p>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
        <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'rgba(79, 70, 229, 0.2)', borderRadius: '4px', color: '#a5b4fc' }}>
          {task.projectName}
        </span>
        {user?.role === 'Admin' && (
          <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px' }}>
            👤 {task.assignedUserName}
          </span>
        )}
      </div>

      {task.dueDate && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: new Date(task.dueDate) < new Date() && task.status !== 'Completed' ? 'var(--danger)' : 'var(--text-muted)', marginTop: '4px' }}>
          <Clock size={14} />
          {format(new Date(task.dueDate), 'MMM dd, yyyy')}
        </div>
      )}
    </div>
  );

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Tasks</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage and track progress</p>
        </div>
        {user?.role === 'Admin' && (
          <button className="glass-button" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            Create Task
          </button>
        )}
      </div>

      <div className="kanban-board">
        {['Pending', 'In Progress', 'Completed'].map((status) => (
          <div 
            key={status} 
            className="kanban-column"
            onDrop={(e) => handleDrop(e, status)}
            onDragOver={handleDragOver}
          >
            <div className={`kanban-header ${status === 'In Progress' ? 'progress' : status.toLowerCase()}`}>
              {status} ({tasks.filter(t => t.status === status).length})
            </div>
            {tasks.filter(t => t.status === status).map(renderTaskCard)}
            {tasks.filter(t => t.status === status).length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--glass-border)', borderRadius: '8px' }}>
                Drop tasks here
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content">
            <h2 style={{ fontSize: '1.5rem' }}>Create New Task</h2>
            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Task Title</label>
                <input 
                  type="text" 
                  className="glass-input" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  className="glass-input" 
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Project</label>
                  <select 
                    className="glass-input" 
                    value={projectId} 
                    onChange={(e) => setProjectId(e.target.value)}
                    style={{ backgroundColor: 'var(--bg-color)' }}
                    required
                  >
                    <option value="" disabled>Select Project</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Assign To</label>
                  <select 
                    className="glass-input" 
                    value={assignedTo} 
                    onChange={(e) => setAssignedTo(e.target.value)}
                    style={{ backgroundColor: 'var(--bg-color)' }}
                    required
                  >
                    <option value="" disabled>Select User</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input 
                  type="date" 
                  className="glass-input" 
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button type="button" className="glass-button" style={{ background: 'transparent', border: '1px solid var(--glass-border)' }} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="glass-button">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
