import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Users, BookOpen, Settings } from 'lucide-react';

export const Sidebar = () => {
  return (
    <aside className="sidebar" style={sidebarStyle}>
      <nav>
        <ul style={ulStyle}>
          <li>
            <NavLink to="/superadmin" style={linkStyle} activeStyle={activeLinkStyle}>
              <BarChart3 size={18} /> Superadmin
            </NavLink>
          </li>
          <li>
            <NavLink to="/teacher" style={linkStyle} activeStyle={activeLinkStyle}>
              <Users size={18} /> Teacher
            </NavLink>
          </li>
          <li>
            <NavLink to="/student" style={linkStyle} activeStyle={activeLinkStyle}>
              <BookOpen size={18} /> Student
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" style={linkStyle} activeStyle={activeLinkStyle}>
              <Settings size={18} /> Settings
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

const sidebarStyle = {
  width: '220px',
  background: 'var(--color-surface)',
  borderRight: '1px solid var(--color-border)',
  padding: '1rem',
  overflowY: 'auto',
};

const ulStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
};

const linkStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: 'var(--color-text)',
  textDecoration: 'none',
  padding: '0.5rem 0.75rem',
  borderRadius: 'var(--radius-sm)',
};

const activeLinkStyle = {
  background: 'var(--color-primary)',
  color: '#fff',
};
