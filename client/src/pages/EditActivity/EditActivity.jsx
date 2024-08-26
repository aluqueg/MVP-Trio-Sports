import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";
import { BsCalendar3 } from 'react-icons/bs'; 
import axios from "axios";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes } from "date-fns";
import { es } from "date-fns/locale";
import { TrioContext } from "../../context/TrioContextProvider";

import "../AddActivity/addActivityStyle.css"

registerLocale("es", es);

export const EditActivity = () => {
  const { token } = useContext(TrioContext); 
  const { activity_id } = useParams(); 
  const [dateTimeActivity, setDateTimeActivity] = useState(null);
  const [limitUsers, setLimitUsers] = useState("");
  const [text, setText] = useState("");
  const [activityCity, setActivityCity] = useState("");
  const [activityAddress, setActivityAddress] = useState(""); 
  const [details, setDetails] = useState("");
  const [mapsLink, setMapsLink] = useState("");
  const [sportName, setSportName] = useState(""); 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const navigate = useNavigate(); 

  // Cargar los datos de la actividad existente
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/activity/getOneActivity/${activity_id}`,
          {
            headers: { Authorization: `Bearer ${token}` }, // token 
          }
        );
        const activity = response.data;
        setText(activity.text);
        setLimitUsers(activity.limit_users);
        setActivityCity(activity.activity_city);
        setActivityAddress(activity.activity_address);
        setDetails(activity.details);
        setMapsLink(activity.maps_link);
        setDateTimeActivity(new Date(activity.date_time_activity)); 
        setSportName(activity.sport_name); 
      } catch (error) {
        console.error("Error al cargar la actividad:", error);
      }
    };
    fetchActivity();
  }, [activity_id, token]);

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
  
      const response = await axios.put(
        `http://localhost:4000/api/activity/editActivity/${activity_id}`,
        {
          date_time_activity: formattedDateTime,
          limit_users: limitUsers || null,
          text,
          activity_city: activityCity,
          activity_address: activityAddress,
          details,
          maps_link: mapsLink || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // token 
        }
      );
  
      console.log(response); 
  
      if (response.status === 200) {
        setSuccess("Actividad actualizada con éxito");
        setTimeout(() => {
          navigate("/profile"); // Redirigir a la vista de perfil actualizada
        }, 2000);
      }
    } catch (error) {
      console.error("Error al actualizar la actividad:", error); 
      if (error.response && error.response.data) {
        setError(error.response.data.error);
      } else {
        setError("Error al actualizar la actividad. Inténtalo de nuevo.");
      }
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/activity/deleteActivity/${activity_id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }, // token
        }
      );
      console.log(response); 

      setSuccess("Actividad eliminada correctamente.");  

      setTimeout(() => {
        navigate("/profile"); // Redirigir a la vista de perfil actualizada después de eliminar
      }, 2000);  
    } catch (error) {
      console.error("Error al eliminar la actividad:", error);
      setError("Error al eliminar la actividad. Inténtalo de nuevo.");
    }
  };
  
  

  const handleCancel = () => {
    navigate("/profile"); // Redirigir a la vista de perfil actualizada
  };

  return (
    <Container>
       <h2>Editar Actividad/Evento</h2>
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
            <Form.Group controlId="formLimitUsers">
              <Form.Label>Número de Participantes</Form.Label>
              <Form.Control
                type="number"
                value={limitUsers}
                onChange={(e) => setLimitUsers(e.target.value < 0 ? 0 : e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formSportName">
              <Form.Label>Deporte</Form.Label>
              <Form.Control
                type="text"
                value={sportName}
                disabled 
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
            maxLength={255} 
          />
          <Form.Text className="text-muted">
            {`${details.length}/255 caracteres`}
          </Form.Text>
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3 me-3">
          Aceptar
        </Button>
        <Button variant="danger" type="button" className="mt-3 me-3" onClick={handleDelete}>
          Borrar Actividad
        </Button>
        <Button variant="secondary" type="button" className="mt-3" onClick={handleCancel}>
          Cancelar
        </Button>
      </Form>
    </Container>
  );
};

