import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert, Row, Col, InputGroup } from "react-bootstrap";
import { BsCalendar3 } from 'react-icons/bs'; 
import axios from "axios";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes } from "date-fns";
import { es } from "date-fns/locale";
import { ModalCreateSport } from "../../components/ModalCreateSport/ModalCreateSport";
import { TrioContext } from "../../context/TrioContextProvider";

import "../AddActivity/addActivityStyle.css"

registerLocale("es", es);

export const AddActivity = () => {
  const { token, sports, setSports } = useContext(TrioContext); 
  const [dateTimeActivity, setDateTimeActivity] = useState(null);
  const [limitUsers, setLimitUsers] = useState("");
  const [text, setText] = useState("");
  const [activityCity, setActivityCity] = useState("");
  const [activityAddress, setActivityAddress] = useState(""); 
  const [details, setDetails] = useState("");
  const [sportId, setSportId] = useState("");
  const [mapsLink, setMapsLink] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  
  const navigate = useNavigate(); 

  // Cargar la lista de deportes solo si no se han cargado antes
  useEffect(() => {
    if (!sports.length) {
      axios.get("http://localhost:4000/api/sports/allSports", {
        headers: { Authorization: `Bearer ${token}` }, //  token 
      })
      .then(res => {
        setSports(res.data); 
      })
      .catch(error => {
        console.error("Error al cargar los deportes:", error);
      });
    }
  }, [sports, setSports, token]);

  const handleSportCreated = (newSport) => {
    setSports((prevSports) => [...prevSports, newSport]);
    setSportId(newSport.sport_id); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const year = dateTimeActivity.getFullYear();
      const month = String(dateTimeActivity.getMonth() + 1).padStart(2, '0');
      const day = String(dateTimeActivity.getDate()).padStart(2, '0');
      const hours = String(dateTimeActivity.getHours()).padStart(2, '0');
      const minutes = String(dateTimeActivity.getMinutes()).padStart(2, '0');
      const seconds = '00'; 

      const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      const response = await axios.post(
        "http://localhost:4000/api/activity/createActivity",
        {
          date_time_activity: formattedDateTime,
          limit_users: limitUsers || null,
          text,
          activity_city: activityCity,
          activity_address: activityAddress,
          details,
          sport_id: Number(sportId),
          user_id: 1, 
          maps_link: mapsLink || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // token 
        }
      );

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

  const handleCancel = () => {
    navigate("/allActivities"); 
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
            placeholder="Introduce un título para la actividad o evento"
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
                    setShowModal(true); 
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
                <option value="addSport">Añadir deporte</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formLimitUsers">
              <Form.Label>Número de Participantes</Form.Label>
              <Form.Control
                type="number"
                value={limitUsers}
                onChange={(e) => setLimitUsers(e.target.value < 0 ? 0 : e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="formDateTimeActivity">
          <Form.Label>Día y Hora</Form.Label>
          <div className="add-activity-datepicker-container">
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
              minDate={new Date()}
              dateFormat="Pp"
              locale="es"
              placeholderText="Selecciona día y hora"
              className="form-control add-activity-datepicker"
              required
            />
            <BsCalendar3 className="add-activity-calendar-icon" />
          </div>
        </Form.Group>

        <Form.Group controlId="formActivityCity">
          <Form.Label>Ciudad</Form.Label>
          <Form.Control
            type="text"
            placeholder="Introduce la ciudad"
            value={activityCity}
            onChange={(e) => setActivityCity(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formActivityAddress">
          <Form.Label>Dirección</Form.Label>
          <Form.Control
            type="text"
            placeholder="Introduce la dirección"
            value={activityAddress}
            onChange={(e) => setActivityAddress(e.target.value)}
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

        <Button variant="secondary" type="button" className="mt-3 me-3" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit" className="mt-3">
          Crear Actividad
        </Button>
      </Form>

      {/* Modal para crear un nuevo deporte */}
      <ModalCreateSport
        show={showModal}
        closeModal={() => setShowModal(false)}
        onSportCreated={handleSportCreated}
        existingSports={sports}
      />
    </Container>
  );
};



