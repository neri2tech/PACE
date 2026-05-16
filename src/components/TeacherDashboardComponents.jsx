import React, { useState } from 'react';
import { AlertCircle, FileText, Send, UserCheck, UserX, UserMinus, Plus } from 'lucide-react';

// 1. Class Performance Grid (Heatmap)
export const ClassPerformanceGrid = ({ students, onSelectStudent }) => {
  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <h2>Class Heatmap</h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Instantly spot students needing intervention based on their progress status.</p>
      
      <div className="data-grid">
        {students.map(student => (
          <div 
            key={student.id} 
            className="card" 
            style={{ cursor: 'pointer', borderLeft: `4px solid var(--color-status-${student.statusColor})` }}
            onClick={() => onSelectStudent(student)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0 }}>{student.name}</h3>
              <span className={`status-badge status-${student.statusColor}`}>{student.status}</span>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Progress: {student.progress}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// 2. Student Intervention Engine
export const StudentInterventionView = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <div className="card" style={{ marginBottom: '2rem', border: '2px solid var(--color-secondary)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Intervention Engine: {student.name}</h2>
        <button className="btn btn-outline" onClick={onClose}>Close</button>
      </div>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Push specific resources to this student based on their roadblocks.</p>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <input type="text" className="form-input" placeholder="Enter resource URL or select file..." style={{ flex: 1 }} />
        <button className="btn btn-primary"><Send size={18} /> Push Resource</button>
      </div>
    </div>
  );
};

// 3. Resource Manager (Bulk Continuity)
export const ResourceManager = () => {
  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <h2>Resource Manager & Bulk Continuity</h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Assign Lockdown Module Packs to the entire class with one click.</p>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <FileText size={24} style={{ color: 'var(--color-primary)' }} />
          <div>
            <h4 style={{ margin: 0 }}>Week 3 Math Pack</h4>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Includes 3 PDFs and 2 Video Links</span>
          </div>
        </div>
        <button className="btn btn-primary">Assign to All Students</button>
      </div>
    </div>
  );
};

// 4. Teacher Flexibility Controls
export const TeacherFlexibilityControls = () => {
  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <h2>Teacher Flexibility Controls</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
        <div style={{ border: '1px solid var(--color-border)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><UserCheck size={18} /> Dynamic Grouping</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Create custom sub-groups for targeted help.</p>
          <button className="btn btn-outline" style={{ width: '100%' }}><Plus size={18} /> Create New Group</button>
        </div>

        <div style={{ border: '1px solid var(--color-border)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertCircle size={18} /> Status Overrides</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Manually adjust a student's automated heatmap status.</p>
          <button className="btn btn-outline" style={{ width: '100%' }}>Manage Overrides</button>
        </div>
      </div>
    </div>
  );
};
