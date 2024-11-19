"use client";
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleNameChange = (e) => setName(e.target.value);
  const handleAgeChange = (e) => setAge(e.target.value);
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage('');

    if (!name || !age || !file) {
      setError('All fields are required.');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('age', age);
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setSuccessMessage(response.data.message || 'Data submitted successfully!');
        setName('');
        setAge('');
        setFile(null);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error submitting form, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Healthcare Dashboard</h1>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Age:</label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={handleAgeChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="file">Upload File:</label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              required
            />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        {error && <div className="error">{error}</div>}
        {successMessage && <div className="success">{successMessage}</div>}
      </div>
    </div>
  );
}

export default App;

