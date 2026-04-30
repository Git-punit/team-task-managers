import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, FolderKanban, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="sidebar">
      <div>
        <h2 style={{ color: 'var(--text-main)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FolderKanban size={24} color="var(--primary)" />
          TaskSync
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{user?.role} Portal</p>
      </div>

      <div className="sidebar-nav" style={{ flex: 1 }}>
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        <NavLink to="/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <CheckSquare size={20} />
          Tasks
        </NavLink>
        {user?.role === 'Admin' && (
          <NavLink to="/projects" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FolderKanban size={20} />
            Projects
          </NavLink>
        )}
      </div>

      <div className="sidebar-footer">
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {user?.name?.charAt(0)}
          </div>
          <div>
            <p style={{ fontWeight: '500' }}>{user?.name}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.email}</p>
          </div>
        </div>
        <button onClick={logout} className="glass-button danger" style={{ width: '100%', justifyContent: 'center' }}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
