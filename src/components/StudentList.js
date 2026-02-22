import React from 'react';
import './StudentList.css';

const StudentList = ({ students, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading students...</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📚</div>
        <h3>No Students Found</h3>
        <p>Get started by adding your first student!</p>
      </div>
    );
  }

  return (
    <div className="student-list-container">
      <div className="student-list-header">
        <h2>Student Records ({students.length})</h2>
      </div>
      <div className="student-grid">
        {students.map((student) => (
          <div key={student.id} className="student-card">
            <div className="student-card-header">
              <h3>{student.fullName}</h3>
              <div className="student-actions">
                <button
                  className="btn-icon btn-edit"
                  onClick={() => onEdit(student)}
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  className="btn-icon btn-delete"
                  onClick={() => onDelete(student.id)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
            <div className="student-details">
              <div className="detail-item">
                <span className="detail-label">ID Number:</span>
                <span className="detail-value">{student.idNumber}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Course:</span>
                <span className="detail-value">{student.course}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Department:</span>
                <span className="detail-value">{student.department}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Current Units:</span>
                <span className="detail-value highlight">{student.currentUnits}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentList;
