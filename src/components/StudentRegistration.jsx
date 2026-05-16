import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, Download, Users, Key, UserPlus } from 'lucide-react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { firebaseApp } from '../firebase';

export const StudentRegistration = () => {
  const [generatedStudents, setGeneratedStudents] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSingleForm, setShowSingleForm] = useState(false);
  const [singleStudent, setSingleStudent] = useState({ FirstName: '', LastName: '', Grade: '', Email: '' });

  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  // Download a blank template for teachers to fill out
  const handleExportTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([{ FirstName: '', LastName: '', Grade: '', Email: '' }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Class Roster");
    XLSX.writeFile(wb, "PACE_Student_Template.xlsx");
  };

  const processStudent = async (studentData) => {
    const studentId = `PACE-${Math.floor(1000 + Math.random() * 9000)}`;
    const password = Math.random().toString(36).slice(-6).toUpperCase();
    const email = studentData.Email || `${studentId.toLowerCase()}@pace.edu`;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'students', studentId), {
        firstName: studentData.FirstName,
        lastName: studentData.LastName,
        grade: studentData.Grade,
        email,
        studentId,
        password, // stored for teacher reference; usually not recommended in prod without encryption
      });
      return { ...studentData, studentId, password, email };
    } catch (err) {
      console.error("Failed to create student account", err);
      // fallback if email exists
      return { ...studentData, studentId, password: 'ERROR', email };
    }
  };

  const handleAddSingleStudent = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const newStudent = await processStudent(singleStudent);
    setGeneratedStudents(prev => [...prev, newStudent]);
    setSingleStudent({ FirstName: '', LastName: '', Grade: '', Email: '' });
    setShowSingleForm(false);
    setIsProcessing(false);
  };

  // Handle the file upload and generate IDs/Credentials
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      const processed = [];
      for (const student of json) {
        const res = await processStudent(student);
        processed.push(res);
      }

      setGeneratedStudents(prev => [...prev, ...processed]);
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
          <Upload size={18} /> Bulk Upload Roster
          <input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            style={{ display: 'none' }} 
            onChange={handleFileUpload} 
          />
        </label>

        <button onClick={() => setShowSingleForm(!showSingleForm)} className="btn btn-outline" style={{ marginLeft: 'auto' }}>
          <UserPlus size={18} /> Add Single Student
        </button>
      </div>

      {showSingleForm && (
        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
          <h3>Add Single Student</h3>
          <form onSubmit={handleAddSingleStudent} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>First Name</label>
              <input type="text" className="form-input" required value={singleStudent.FirstName} onChange={(e) => setSingleStudent({...singleStudent, FirstName: e.target.value})} />
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Last Name</label>
              <input type="text" className="form-input" required value={singleStudent.LastName} onChange={(e) => setSingleStudent({...singleStudent, LastName: e.target.value})} />
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Grade</label>
              <input type="text" className="form-input" required value={singleStudent.Grade} onChange={(e) => setSingleStudent({...singleStudent, Grade: e.target.value})} />
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email (Optional)</label>
              <input type="email" className="form-input" value={singleStudent.Email} onChange={(e) => setSingleStudent({...singleStudent, Email: e.target.value})} />
            </div>
            <div style={{ flex: '1 1 100%' }}>
              <button type="submit" className="btn btn-primary" disabled={isProcessing}>
                {isProcessing ? 'Adding...' : 'Create Student'}
              </button>
              <button type="button" className="btn btn-outline" style={{ marginLeft: '1rem' }} onClick={() => setShowSingleForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {isProcessing && <p>Processing...</p>}

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
                <th style={{ padding: '0.75rem 1rem' }}>Email</th>
                <th style={{ padding: '0.75rem 1rem' }}>Student ID</th>
                <th style={{ padding: '0.75rem 1rem' }}>Password</th>
              </tr>
            </thead>
            <tbody>
              {generatedStudents.map((student, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>{student.FirstName} {student.LastName}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{student.Grade}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{student.email}</td>
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
