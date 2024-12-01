import React, { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    Idade: "",
    "Histórico tabágico": "",
    "Distância caminhada em 6 minutos (em metros)": "",
    VEF: "",
    "VEF1 previsto": "",
    "Capacidade vital forçada": "",
    "Capacidade vital forçada (previsão)": "",
    "Teste de Avaliação da DPOC": "",
    "Indíce de qualidade de vida": "",
    "Quartis de Idade": "",
    "Genêro": "",
    "Teve/tem diabetes?": "",
    "Teve/tem hipertensão?": "",
    "Teve/tem atrilação fibrial?": "",
    "Teve/tem doença arterial coronária?": "",
  });

  const tooltips = {
    Idade: "Insira sua idade em anos.",
    "Histórico tabágico": "Informe o valor do histórico de tabagismo.",
    "Distância caminhada em 6 minutos (em metros)": "Informe a distância que você consegue caminhar em 6 minutos.",
    VEF: "Insira o valor do VEF.",
    "VEF1 previsto": "Insira o valor previsto do VEF1.",
    "Capacidade vital forçada": "Insira a capacidade vital forçada.",
    "Capacidade vital forçada (previsão)": "Insira a previsão da capacidade vital forçada.",
    "Teste de Avaliação da DPOC": "Insira o resultado do teste de avaliação da DPOC.",
    "Indíce de qualidade de vida": "Insira o índice de qualidade de vida.",
    "Quartis de Idade": "Informe o quartil de idade.",
    "Genêro": "Informe seu gênero.",
    "Teve/tem diabetes?": "Informe se você tem ou teve diabetes.",
    "Teve/tem hipertensão?": "Informe se você tem ou teve hipertensão.",
    "Teve/tem atrilação fibrial?": "Informe se você tem ou teve arritmia fibrial.",
    "Teve/tem doença arterial coronária?": "Informe se você tem ou teve doença arterial coronária.",
  };

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

    // Definir a ordem dos campos
    const orderedFields = [
      "Idade",
      "Histórico tabágico",
      "Distância caminhada em 6 minutos (em metros)",
      "VEF",
      "VEF1 previsto",
      "Capacidade vital forçada",
      "Capacidade vital forçada (previsão)",
      "Teste de Avaliação da DPOC",
      "Indíce de qualidade de vida",
      "Quartis de Idade",
      "Genêro",
      "Teve/tem diabetes?",
      "Teve/tem hipertensão?",
      "Teve/tem atrilação fibrial?",
      "Teve/tem doença arterial coronária?",
    ];

    // Criar o objeto 'features' preservando a ordem dos campos
    const orderedData = orderedFields.reduce((acc, key) => {
      acc[key] = formData[key];
      return acc;
    }, {});

    try {
      const response = await fetch("https://copd-model-production-5213.up.railway.app/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ features: orderedData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      const severityMap = {
        0: "Leve",
        1: "Moderado",
        2: "Severo",
        3: "Muito severo",
      };

      const severity = severityMap[data.prediction] || "Desconhecido";
      setResult(severity);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="App">
      <h1>Formulário de Predição</h1>
      <form onSubmit={handleSubmit} className="form-container">
        {Object.keys(formData).map((key) => {
          if (key === "Genêro") {
            return (
              <div key={key} className="form-group">
                <label htmlFor={key}>{key}:</label>
                <select
                  id={key}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="form-input"
                  title={tooltips[key]}
                >
                  <option value="">Selecione</option>
                  <option value="0">Feminino</option>
                  <option value="1">Masculino</option>
                </select>
              </div>
            );
          }
          
          if (["Teve/tem diabetes?", "Teve/tem hipertensão?", "Teve/tem atrilação fibrial?", "Teve/tem doença arterial coronária?"].includes(key)) {
            return (
              <div key={key} className="form-group">
                <label htmlFor={key}>{key}:</label>
                <select
                  id={key}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="form-input"
                  title={tooltips[key]}
                >
                  <option value="">Selecione</option>
                  <option value="0">Não</option>
                  <option value="1">Sim</option>
                </select>
              </div>
            );
          }

          return (
            <div key={key} className="form-group">
              <label htmlFor={key}>{key}:</label>
              <input
                type="text"
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="form-input"
                title={tooltips[key]}
              />
            </div>
          );
        })}
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
