import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TrioContext } from "../../context/TrioContextProvider";
import { Container } from "react-bootstrap";

export const AddSport = () => {
  const { token } = useContext(TrioContext);
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

    try {
      const response = await axios.post(
        "http://localhost:4000/api/sports/createSport",
        { sport_name: sportName },
        {
          headers: { Authorization: `Bearer ${token}` }, // token
        }
      );

      if (response.status === 201) {
        setSuccess("Deporte creado con éxito");
        // Redirigir al formulario de crear actividad después de un breve retraso
        setTimeout(() => {
          navigate("/addActivity");
        }, 2000);
      }
    } catch (error) {
      console.log("Error en la solicitud:", error.response || error);

      if (error.response && error.response.data) {
        setError(error.response.data.error || "Error al crear el deporte.");
      } else {
        setError("Error al crear el deporte. Inténtalo de nuevo.");
      }
    }
  };

  return (
    <Container fluid="xl">
      <h2>Crear Nuevo Deporte</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre del Deporte:</label>
          <input
            type="text"
            name="sportName"
            value={sportName}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Crear Deporte</button>
      </form>
    </Container>
  );
};
