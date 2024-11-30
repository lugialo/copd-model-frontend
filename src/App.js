import React, { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    id: "",
    age: "",
    PackHistory: "",
    MWT1Best: "",
    FEV1: "",
    FEV1PRED: "",
    FVC: "",
    FVCPRED: "",
    CAT: "",
    SGRQ: "",
    AGEquartiles: "",
    copd: "",
    gender: "",
    Diabetes: "",
    hipertension: "",
    AtrialFib: "",
    IHD: "",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const valuesArray = Object.values(formData).map((value) => {
      const number = parseFloat(value);
      return isNaN(number) ? value : number;
    });

    console.log("Sending data:", valuesArray);

    try {
      const response = await fetch(
        "https://copd-model-production-5213.up.railway.app/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ features: valuesArray }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      // Convert prediction (numeric) into severity description
      const severityMap = {
        0: "Leve",
        1: "Moderado",
        2: "Severo",
        3: "Muito severo"
      };

      const severity = severityMap[data.prediction] || "Desconhecido"; // Default to "Desconhecido" if value doesn't match
      setResult(severity);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="App">
      <h1>Formulário de Predição</h1>
      <form onSubmit={handleSubmit} className="form-container">
        {Object.keys(formData).map((key) => (
          <div key={key} className="form-group">
            <label htmlFor={key}>{key}:</label>
            <input
              type="text"
              id={key}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        ))}
        <button type="submit" className="form-submit">
          ENVIAR
        </button>
      </form>

      {/* Exibindo o resultado da predição */}
      {result && (
        <div className="result">
          <h2>Resultado da Predição:</h2>
          <p>{`${result}`}</p>
        </div>
      )}
    </div>
  );
}

export default App;
