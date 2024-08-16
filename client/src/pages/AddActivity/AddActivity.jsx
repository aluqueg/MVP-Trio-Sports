import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";
import axios from "axios";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes } from "date-fns";
import { es } from "date-fns/locale";

registerLocale("es", es);

export const AddActivity = () => {
  const [dateTimeActivity, setDateTimeActivity] = useState(
    setHours(setMinutes(new Date(), 30), 16)
  );
  const [limitUsers, setLimitUsers] = useState("");
  const [text, setText] = useState("");
  const [activityCity, setActivityCity] = useState("");
  const [details, setDetails] = useState("");
  const [sportId, setSportId] = useState("");
  const [sports, setSports] = useState([]); // Estado para la lista de deportes
  const [mapsLink, setMapsLink] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Cargar la lista de deportes desde la base de datos al montar el componente
  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/sports/allSports");
        console.log("-------------------------", response.data)
        setSports(response.data); // Guardar los deportes en el estado
      } catch (error) {
        console.error("Error al cargar los deportes:", error);
      }
    };

    fetchSports();
  }, []); // El array vacío asegura que la función se ejecute solo una vez cuando el componente se monta

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const formattedDateTime = dateTimeActivity
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      const response = await axios.post("http://localhost:4000/api/activity/createActivity", {
        date_time_activity: formattedDateTime,
        limit_users: limitUsers || null,
        text,
        activity_city: activityCity,
        details,
        sport_id: sportId,
        user_id: 1,
        maps_link: mapsLink || null,
      });

      if (response.status === 201) {
        setSuccess("Actividad creada con éxito");
        setTimeout(() => {
          navigate("/allActivities");
        }, 2000);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error);
      } else {
        setError("Error al crear la actividad. Inténtalo de nuevo.");
      }
    }
  };

  return (
    <Container>
      <h2>Crear Nueva Actividad/Evento</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formText">
          <Form.Label>Título</Form.Label>
          <Form.Control
            type="text"
            placeholder="Encuentro de senderismo"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </Form.Group>

        <Row>
          <Col>
            <Form.Group controlId="formSportId">
              <Form.Label>Deporte</Form.Label>
              <Form.Control
                as="select"
                value={sportId}
                onChange={(e) => {
                  if (e.target.value === "addSport") {
                    navigate("/addSport", {
                      state: { from: "/addActivity" },
                    }); // Redirigir al formulario de añadir deporte
                  } else {
                    setSportId(e.target.value);
                  }
                }}
                required
              >
                <option value="">Elegir...</option>
                {sports.map((sport) => (
                  <option key={sport.sport_id} value={sport.sport_id}>
                    {sport.sport_name}
                  </option>
                ))}
                <option value="addSport">Añadir deporte</option> {/* Opción para añadir deporte */}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formLimitUsers">
              <Form.Label>Número de Participantes</Form.Label>
              <Form.Control
                type="number"
                placeholder=""
                value={limitUsers}
                onChange={(e) => setLimitUsers(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="formDateTimeActivity">
          <Form.Label>Día y Hora</Form.Label>
          <DatePicker
            selected={dateTimeActivity}
            onChange={(date) => setDateTimeActivity(date)}
            showTimeSelect
            timeCaption="Hora"
            excludeTimes={[
              setHours(setMinutes(new Date(), 0), 17),
              setHours(setMinutes(new Date(), 30), 18),
              setHours(setMinutes(new Date(), 30), 19),
              setHours(setMinutes(new Date(), 30), 17),
            ]}
            dateFormat="Pp"
            locale="es"
            placeholderText="Selecciona día y hora"
            className="form-control"
            required
          />
        </Form.Group>

        <Form.Group controlId="formActivityCity">
          <Form.Label>Dirección</Form.Label>
          <Form.Control
            type="text"
            placeholder="Introduce la dirección"
            value={activityCity}
            onChange={(e) => setActivityCity(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formMapsLink">
          <Form.Label>Google Maps Link</Form.Label>
          <Form.Control
            type="url"
            placeholder="Introduce el enlace de Google Maps"
            value={mapsLink}
            onChange={(e) => setMapsLink(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formDetails">
          <Form.Label>Descripción Breve</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Introduce una breve descripción"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Crear Actividad
        </Button>
      </Form>
    </Container>
  );
};
