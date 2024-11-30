import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    id: '',
    age: '',
    PackHistory: '',
    MWT1Best: '',
    FEV1: '',
    FEV1PRED: '',
    FVC: '',
    FVCPRED: '',
    CAT: '',
    SGRQ: '',
    AGEquartiles: '',
    copd: '',
    gender: '',
    Diabetes: '',
    hipertension: '',
    AtrialFib: '',
    IHD: ''
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Convert formData values to numbers
    const valuesArray = Object.values(formData).map(value => {
      const number = parseFloat(value);
      return isNaN(number) ? value : number;
    });

    console.log('Sending data:', valuesArray);

    try {
      const response = await fetch('https://copd-model-production-5213.up.railway.app/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ features: valuesArray }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <h1>Prediction Form</h1>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label htmlFor={key}>{key}:</label>
            <input
              type="text"
              id={key}
              name={key}
              value={formData[key]}
              onChange={handleChange}
            /><br /><br />
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
      {result !== null && (
        <div>
          <h2>Prediction Result:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

export default App;