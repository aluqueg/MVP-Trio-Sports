import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
/*import { Form, Button, Container, Alert } from "react-bootstrap"; se puede estilar directamente o traer un from de react-boostrap*/
import axios from "axios";

export const AddSport = () => {
  const [sportName, setSportName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSportName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    console.log("Enviando deporte:", sportName); // Verificar datos enviados

    try {
      const response = await axios.post(
        "http://localhost:4000/api/sports/createSport",
        { sport_name: sportName }
      );

      console.log("Respuesta del servidor:", response); // Verificar respuesta

      if (response.status === 201) {
        setSuccess("Deporte creado con éxito");
        setTimeout(() => {
          navigate("/addActivity");
        }, 2000);
      }
    } catch (error) {
      console.log("Error en la solicitud:", error.response || error); // Verificar errores

      if (error.response && error.response.data) {
        setError(error.response.data);
      } else {
        setError("Error al crear el deporte. Inténtalo de nuevo.");
      }
    }
  };

  return (
    <div>
      <h2>Crear Nuevo Deporte</h2>
      {error && <div>{error}</div>}
      {success && <div>{success}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre del Deporte:</label>
          <input
            type="text"
            name="sportName"
            value={sportName}
            onChange={handleChange} // handleChange para actualizar el estado
          />
        </div>
        <button type="submit">Crear Deporte</button>
      </form>
    </div>
  );
};
