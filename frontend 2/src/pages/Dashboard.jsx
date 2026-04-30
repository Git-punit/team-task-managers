import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { format } from 'date-fns';
import { AlertCircle, CheckCircle2, Clock, ListTodo } from 'lucide-react';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [metrics, setMetrics] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0, overdue: 0 });
  const [allTasks, setAllTasks] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [metricsRes, tasksRes] = await Promise.all([
          axios.get('http://localhost:5001/api/dashboard'),
          axios.get('http://localhost:5001/api/tasks')
        ]);
        setMetrics(metricsRes.data);
        
        setAllTasks(tasksRes.data);
        
        // Get 5 most recent tasks
        const sortedTasks = [...tasksRes.data]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentTasks(sortedTasks);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  let displayedTasks = recentTasks;
  let tableTitle = 'Recent Tasks';
  
  if (selectedStatus === 'Total') {
    displayedTasks = allTasks;
    tableTitle = 'All Tasks';
  } else if (selectedStatus === 'Overdue') {
    const today = new Date().toISOString();
    displayedTasks = allTasks.filter(t => t.dueDate && t.dueDate < today && t.status !== 'Completed');
    tableTitle = 'Overdue Tasks';
  } else if (selectedStatus) {
    displayedTasks = allTasks.filter(t => t.status === selectedStatus);
    tableTitle = `${selectedStatus} Tasks`;
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.name}. Here's what's happening.</p>
      </div>

      <div className="metrics-grid" style={{ marginBottom: '40px' }}>
        <div className="glass-panel metric-card total" onClick={() => setSelectedStatus('Total')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Total Tasks</span>
            <ListTodo size={20} color="var(--primary)" />
          </div>
          <span style={{ fontSize: '2.5rem', fontWeight: '700' }}>{metrics.total}</span>
        </div>

        <div className="glass-panel metric-card pending" onClick={() => setSelectedStatus('Pending')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Pending</span>
            <Clock size={20} color="var(--warning)" />
          </div>
          <span style={{ fontSize: '2.5rem', fontWeight: '700' }}>{metrics.pending}</span>
        </div>

        <div className="glass-panel metric-card progress" onClick={() => setSelectedStatus('In Progress')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>In Progress</span>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#3b82f6', boxShadow: '0 0 10px #3b82f6' }} />
          </div>
          <span style={{ fontSize: '2.5rem', fontWeight: '700' }}>{metrics.inProgress}</span>
        </div>

        <div className="glass-panel metric-card completed" onClick={() => setSelectedStatus('Completed')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Completed</span>
            <CheckCircle2 size={20} color="var(--success)" />
          </div>
          <span style={{ fontSize: '2.5rem', fontWeight: '700' }}>{metrics.completed}</span>
        </div>

        <div className="glass-panel metric-card overdue" onClick={() => setSelectedStatus('Overdue')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Overdue</span>
            <AlertCircle size={20} color="var(--danger)" />
          </div>
          <span style={{ fontSize: '2.5rem', fontWeight: '700' }}>{metrics.overdue}</span>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{tableTitle}</h2>
          {selectedStatus && (
            <button 
              className="glass-button" 
              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              onClick={() => setSelectedStatus(null)}
            >
              Clear Filter
            </button>
          )}
        </div>
        {displayedTasks.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No tasks found.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Status</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {displayedTasks.map(task => (
                  <tr key={task.id}>
                    <td style={{ fontWeight: '500' }}>{task.title}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{task.projectName || 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${task.status === 'In Progress' ? 'progress' : task.status.toLowerCase()}`}>
                        {task.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      {task.dueDate ? format(new Date(task.dueDate), 'MMM dd, yyyy') : 'No date'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
