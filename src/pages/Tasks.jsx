import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { AuthContext } from '../context/AuthContext';
import { Clock, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useContext(AuthContext);

  const fetchData = async () => {
    try {
      const tasksRes = await axios.get(`${API_BASE_URL}/api/tasks`);
      setTasks(tasksRes.data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

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
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Tasks</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage and track your team's progress</p>
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
    </div>
  );
}
