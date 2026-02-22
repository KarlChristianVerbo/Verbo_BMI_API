import React, { useState, useEffect } from 'react';
import './StudentForm.css';

const StudentForm = ({ student, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    course: '',
    idNumber: '',
    department: '',
    currentUnits: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        fullName: student.fullName || '',
        course: student.course || '',
        idNumber: student.idNumber || '',
        department: student.department || '',
        currentUnits: student.currentUnits || ''
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!formData.course.trim()) {
      newErrors.course = 'Course is required';
    }

    if (!formData.idNumber.trim()) {
      newErrors.idNumber = 'ID Number is required';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!formData.currentUnits.trim()) {
      newErrors.currentUnits = 'Current Units is required';
    } else if (isNaN(formData.currentUnits) || parseFloat(formData.currentUnits) < 0) {
      newErrors.currentUnits = 'Current Units must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      await onSubmit({
        fullName: formData.fullName.trim(),
        course: formData.course.trim(),
        idNumber: formData.idNumber.trim(),
        department: formData.department.trim(),
        currentUnits: parseFloat(formData.currentUnits)
      });
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>{student ? 'Edit Student' : 'Add New Student'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? 'error' : ''}
              placeholder="Enter full name"
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="idNumber">ID Number *</label>
            <input
              type="text"
              id="idNumber"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              className={errors.idNumber ? 'error' : ''}
              placeholder="Enter ID number"
            />
            {errors.idNumber && <span className="error-text">{errors.idNumber}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="course">Course *</label>
            <input
              type="text"
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              className={errors.course ? 'error' : ''}
              placeholder="Enter course"
            />
            {errors.course && <span className="error-text">{errors.course}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="department">Department *</label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={errors.department ? 'error' : ''}
              placeholder="Enter department"
            />
            {errors.department && <span className="error-text">{errors.department}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="currentUnits">Current Units *</label>
            <input
              type="number"
              id="currentUnits"
              name="currentUnits"
              value={formData.currentUnits}
              onChange={handleChange}
              className={errors.currentUnits ? 'error' : ''}
              placeholder="Enter current units"
              min="0"
              step="0.5"
            />
            {errors.currentUnits && <span className="error-text">{errors.currentUnits}</span>}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-submit">
              {student ? 'Update Student' : 'Add Student'}
            </button>
            <button type="button" className="btn btn-cancel" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
