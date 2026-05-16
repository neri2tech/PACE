import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const Layout = ({ children }) => (
  <div className="app-layout" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
    <Header />
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto', padding: '2rem', background: 'var(--color-bg)' }}>
        {children}
      </main>
    </div>
  </div>
);
