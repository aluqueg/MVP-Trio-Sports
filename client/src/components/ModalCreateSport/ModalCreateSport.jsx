import { useState } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import axios from "axios";

export const ModalCreateSport = ({ show, closeModal, onSportCreated, existingSports, addSports }) => {
  const [sportName, setSportName] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setSportName(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Verificar si el deporte ya existe en la lista
    const sportExists = existingSports.some((sport) => sport.sport_name.toLowerCase() === sportName.toLowerCase());

    if (sportExists) {
      setError("El deporte ya existe");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/sports/createSport",
        { sport_name: sportName }
      );

      console.log("Respuesta del servidor:", response);

      if (response.status === 201) {
        onSportCreated(response.data); // Actualizar la lista de deportes
        setSportName(""); // Limpiar el campo de entrada
        closeModal(); // Cerrar el modal
        addSports(response.data.sport_name);
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
    <Modal show={show} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Crear nuevo deporte</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="sportName">
            <Form.Control
              type="text"
              name="sportName"
              placeholder="Introduce el nombre del nuevo deporte"
              value={sportName}
              onChange={handleChange}
              required // Asegurarse de que el campo es obligatorio
            />
            {/* Mostrar el mensaje de error justo debajo del input */}
            {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Aceptar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

