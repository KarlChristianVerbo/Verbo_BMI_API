import React, { useState, useEffect } from 'react';
import './App.css';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import { getStudents, createStudent, updateStudent, deleteStudent } from './services/api';

function App() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStudents();
      console.log('Students data received:', data); // Debug log
      if (Array.isArray(data)) {
        setStudents(data);
      } else {
        console.error('Invalid data format:', data);
        setError('Invalid data received from server.');
      }
    } catch (err) {
      let errorMessage = 'Failed to fetch students. ';
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        errorMessage += 'Backend server is not running. Please start it with: cd backend && node server.js';
      } else if (err.response) {
        errorMessage += `Server error: ${err.response.status} - ${err.response.statusText}`;
      } else {
        errorMessage += 'Please check your backend connection.';
      }
      setError(errorMessage);
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (studentData) => {
    try {
      const newStudent = await createStudent(studentData);
      setStudents([...students, newStudent]);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to create student. Please check your backend connection.');
      console.error('Error creating student:', err);
      throw err;
    }
  };

  const handleUpdate = async (id, studentData) => {
    try {
      const updatedStudent = await updateStudent(id, studentData);
      setStudents(students.map(s => s.id === id ? updatedStudent : s));
      setEditingStudent(null);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to update student. Please check your backend connection.');
      console.error('Error updating student:', err);
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id);
        setStudents(students.filter(s => s.id !== id));
        setError(null);
      } catch (err) {
        setError('Failed to delete student. Please check your backend connection.');
        console.error('Error deleting student:', err);
      }
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingStudent(null);
    setShowForm(false);
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>Student Management System</h1>
          <p>Manage student information efficiently</p>
        </header>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="actions">
          <button 
            className="btn btn-primary" 
            onClick={() => {
              setEditingStudent(null);
              setShowForm(true);
            }}
          >
            + Add New Student
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={fetchStudents}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {showForm && (
          <StudentForm
            student={editingStudent}
            onSubmit={editingStudent ? 
              (data) => handleUpdate(editingStudent.id, data) : 
              handleCreate
            }
            onCancel={handleCancel}
          />
        )}

        <StudentList
          students={students}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default App;
