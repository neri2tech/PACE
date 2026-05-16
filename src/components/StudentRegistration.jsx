import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, Download, Users, Key, UserPlus, Sparkles, AlertCircle } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { firebaseApp, firebaseConfig, db } from '../firebase';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const StudentRegistration = () => {
  const [generatedStudents, setGeneratedStudents] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSingleForm, setShowSingleForm] = useState(false);
  const [singleStudent, setSingleStudent] = useState({ FirstName: '', LastName: '', Grade: '', Email: '' });
  const [geminiKey, setGeminiKey] = useState('');
  const [aiEnabled, setAiEnabled] = useState(false);

  // Download a blank template for teachers to fill out
  const handleExportTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([{ FirstName: '', LastName: '', Grade: '', Email: '' }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Class Roster");
    XLSX.writeFile(wb, "PACE_Student_Template.xlsx");
  };

  const processStudent = async (studentData) => {
    const studentId = studentData.StudentID || `PACE-${Math.floor(1000 + Math.random() * 9000)}`;
    const password = Math.random().toString(36).slice(-6).toUpperCase();
    const email = studentData.Email || `${studentId.toLowerCase()}@pace.edu`;

    try {
      // Create a secondary app instance to create user without logging out the current teacher
      const { initializeApp: initApp } = await import('firebase/app');
      const { getAuth: getSecondaryAuth, createUserWithEmailAndPassword: createUser, signOut: secondarySignOut } = await import('firebase/auth');
      
      const secondaryApp = initApp(firebaseConfig, `SecondaryStudent-${studentId}`);
      const secondaryAuth = getSecondaryAuth(secondaryApp);

      const userCredential = await createUser(secondaryAuth, email, password);
      const newUid = userCredential.user.uid;
      
      await secondarySignOut(secondaryAuth);

      // Save student to 'users' collection for centralized role/auth management
      await setDoc(doc(db, 'users', newUid), {
        firstName: studentData.FirstName,
        lastName: studentData.LastName,
        grade: studentData.Grade,
        classSection: studentData.ClassSection || 'Unassigned',
        email,
        studentId,
        password, // stored for reference distribution
        role: 'student',
        createdAt: new Date().toISOString()
      });

      return { ...studentData, studentId, password, email, uid: newUid };
    } catch (err) {
      console.error("Failed to create student account", err);
      return { ...studentData, studentId, password: 'ERROR', email };
    }
  };

  const generateWithAI = async (rosterData) => {
    if (!geminiKey) {
      alert("Please enter your Gemini API Key first!");
      return null;
    }

    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        As an educational database administrator, organize the following student roster.
        1. Generate a unique, professional Student ID for each student (format: PACE-YEAR-INIT-RANDOM, e.g., PACE-2026-JD-482).
        2. Assign each student to a proper 'Class Section' (e.g., '10-A', '10-B') based on their Grade to create a balanced class list.
        3. Ensure the output is strictly a JSON array of objects.

        Roster Data:
        ${JSON.stringify(rosterData)}

        Return format:
        [{"FirstName": "...", "LastName": "...", "Grade": "...", "Email": "...", "StudentID": "...", "ClassSection": "..."}]
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response (sometimes Gemini adds markdown code blocks)
      const jsonMatch = text.match(/\[.*\]/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error("Could not parse AI response");
    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("AI Generation failed. Falling back to manual mode.");
      return null;
    }
  };

  const handleAddSingleStudent = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    let dataToProcess = singleStudent;
    
    if (aiEnabled && geminiKey) {
      const aiResult = await generateWithAI([singleStudent]);
      if (aiResult && aiResult[0]) {
        dataToProcess = aiResult[0];
      }
    }

    const newStudent = await processStudent(dataToProcess);
    setGeneratedStudents(prev => [...prev, newStudent]);
    setSingleStudent({ FirstName: '', LastName: '', Grade: '', Email: '' });
    setShowSingleForm(false);
    setIsProcessing(false);
  };

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
      let json = XLSX.utils.sheet_to_json(worksheet);

      if (aiEnabled && geminiKey) {
        const aiJson = await generateWithAI(json);
        if (aiJson) {
          json = aiJson;
        }
      }

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

      <div style={{ background: 'rgba(37, 99, 235, 0.05)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', border: '1px solid var(--color-primary)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
          <Sparkles size={20} /> Gemini AI Settings
        </h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <input 
              type="password" 
              placeholder="Enter Gemini API Key..." 
              className="form-input" 
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={aiEnabled} onChange={(e) => setAiEnabled(e.target.checked)} />
            <span style={{ fontWeight: '600' }}>Enable AI ID Generation</span>
          </label>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
          <AlertCircle size={12} style={{ verticalAlign: 'middle' }} /> IDs and Class Lists will be optimized using Google Gemini.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={handleExportTemplate} className="btn btn-outline">
          <Download size={18} /> Download Template
        </button>
        
        <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
          <Upload size={18} /> {aiEnabled ? 'AI Bulk Registration' : 'Standard Bulk Upload'}
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
          <h3>Add Single Student {aiEnabled && <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>(AI Enhanced)</span>}</h3>
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
                {isProcessing ? 'Processing...' : 'Create Student'}
              </button>
              <button type="button" className="btn btn-outline" style={{ marginLeft: '1rem' }} onClick={() => setShowSingleForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {isProcessing && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <Sparkles className="animate-pulse" style={{ margin: '0 auto', color: 'var(--color-primary)' }} />
          <p>AI is organizing your roster...</p>
        </div>
      )}

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
                <th style={{ padding: '0.75rem 1rem' }}>Class</th>
                <th style={{ padding: '0.75rem 1rem' }}>Student ID</th>
                <th style={{ padding: '0.75rem 1rem' }}>Password</th>
              </tr>
            </thead>
            <tbody>
              {generatedStudents.map((student, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>{student.FirstName} {student.LastName}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{student.Grade}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{student.ClassSection || 'N/A'}</td>
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
