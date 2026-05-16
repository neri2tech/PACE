import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, Download, Users, Key } from 'lucide-react';

export const StudentRegistration = () => {
  const [generatedStudents, setGeneratedStudents] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Download a blank template for teachers to fill out
  const handleExportTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([{ FirstName: '', LastName: '', Grade: '' }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Class Roster");
    XLSX.writeFile(wb, "PACE_Student_Template.xlsx");
  };

  // Handle the file upload and generate IDs/Credentials
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      // Generate credentials for each student
      const processedStudents = json.map((student) => {
        // Generate a simple readable ID like "MATH-1234"
        const studentId = `PACE-${Math.floor(1000 + Math.random() * 9000)}`;
        // Generate a simple 6-char password
        const password = Math.random().toString(36).slice(-6).toUpperCase();

        return {
          ...student,
          studentId,
          password
        };
      });

      setGeneratedStudents(processedStudents);
      setIsProcessing(false);
    };
    reader.readAsArrayBuffer(file);
  };

  // Export the generated credentials for the teacher to distribute
  const handleExportCredentials = () => {
    const ws = XLSX.utils.json_to_sheet(generatedStudents);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Credentials");
    XLSX.writeFile(wb, "PACE_Student_Credentials.xlsx");
  };

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2><Users size={24} style={{ marginRight: '0.5rem', verticalAlign: 'middle', color: 'var(--color-primary)' }}/> Student Registration Engine</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Bulk import your class roster and auto-generate login credentials.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={handleExportTemplate} className="btn btn-outline">
          <Download size={18} /> Download Template
        </button>
        
        <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
          <Upload size={18} /> Upload Roster
          <input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            style={{ display: 'none' }} 
            onChange={handleFileUpload} 
          />
        </label>
      </div>

      {isProcessing && <p>Processing file...</p>}

      {generatedStudents.length > 0 && (
        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Generated Credentials ({generatedStudents.length} Students)</h3>
            <button onClick={handleExportCredentials} className="btn btn-outline" style={{ borderColor: 'var(--color-status-green)', color: 'var(--color-status-green)' }}>
              <Key size={18} /> Export Credentials
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <thead style={{ backgroundColor: 'var(--color-border)' }}>
              <tr>
                <th style={{ padding: '0.75rem 1rem' }}>Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Grade</th>
                <th style={{ padding: '0.75rem 1rem' }}>Student ID</th>
                <th style={{ padding: '0.75rem 1rem' }}>Password</th>
              </tr>
            </thead>
            <tbody>
              {generatedStudents.map((student, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>{student.FirstName} {student.LastName}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{student.Grade}</td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: '600' }}>{student.studentId}</td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace' }}>{student.password}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
