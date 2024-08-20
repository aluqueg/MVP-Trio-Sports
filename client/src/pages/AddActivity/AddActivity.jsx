import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert, Row, Col, InputGroup } from "react-bootstrap";
import { BsCalendar3 } from 'react-icons/bs'; // Icono de calendario de Bootstrap desde react-icons
import axios from "axios";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes } from "date-fns";
import { es } from "date-fns/locale";
import { ModalCreateSport } from "../../components/ModalCreateSport/ModalCreateSport";
import { TrioContext } from "../../context/TrioContextProvider";

registerLocale("es", es);

export const AddActivity = () => {
  const [dateTimeActivity, setDateTimeActivity] = useState(null);
  const [limitUsers, setLimitUsers] = useState("");
  const [text, setText] = useState("");
  const [activityCity, setActivityCity] = useState("");
  const [activityAddress, setActivityAddress] = useState("");  // Nuevo estado para la dirección específica
  const [details, setDetails] = useState("");
  const [sportId, setSportId] = useState("");
  const [mapsLink, setMapsLink] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const {sports, setSports} = useContext(TrioContext)
  
  const navigate = useNavigate(); // Hook para navegar

  // Cargar la lista de deportes desde la base de datos al montar el componente
  useEffect(() => {
    axios.get("http://localhost:4000/api/sports/allSports")
      .then(res => {
        setSports(res.data); // Guardar los deportes en el estado
        console.log("sports")
      })
      .catch(error => {
        console.error("Error al cargar los deportes:", error);
      });
  }, []);

  const handleSportCreated = (newSport) => {
    setSports((prevSports) => [...prevSports, newSport]);
    setSportId(newSport.sport_id); //Selecciona automáticamente el nuevo deporte
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Extraer la fecha y hora en el formato 'YYYY-MM-DD HH:MM:SS' sin convertir a UTC
      const year = dateTimeActivity.getFullYear();
      const month = String(dateTimeActivity.getMonth() + 1).padStart(2, '0'); // Meses de 0 a 11
      const day = String(dateTimeActivity.getDate()).padStart(2, '0');
      const hours = String(dateTimeActivity.getHours()).padStart(2, '0');
      const minutes = String(dateTimeActivity.getMinutes()).padStart(2, '0');
      const seconds = '00'; // No necesitamos los segundos

      const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      const response = await axios.post(
        "http://localhost:4000/api/activity/createActivity",
        {
          date_time_activity: formattedDateTime,  // Enviar la fecha en el formato correcto para DATETIME
          limit_users: limitUsers || null,  // Enviar null si no hay límite de usuarios
          text,
          activity_city: activityCity,
          activity_address: activityAddress,  // Añadir activity_address aquí
          details,
          sport_id: Number(sportId),  // Convertir sport_id a número si es necesario
          user_id: 1,  // Asegúrate de que este ID existe en la tabla `user`
          maps_link: mapsLink || null,  // Enviar null si no hay enlace de Google Maps
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
    navigate("/allActivities"); // Navegar a la vista de todas las actividades
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
                    setShowModal(true); //Abrir el modal para crear el deporte
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
                <option value="addSport">Añadir deporte</option>{" "}
                {/* Opción para añadir deporte */}
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
                onChange={(e) => setLimitUsers(e.target.value < 0 ? 0 : e.target.value)} // Evitar números negativos
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="formDateTimeActivity">
          <Form.Label>Día y Hora</Form.Label>
          <InputGroup>
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
              minDate={new Date()}  // Deshabilitar fechas anteriores a hoy
              dateFormat="Pp"
              locale="es"
              placeholderText="Selecciona día y hora"
              className="form-control"
              required
            />
            <InputGroup.Text>
              <BsCalendar3 />
            </InputGroup.Text>
          </InputGroup>
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
        existingSports={sports} //pasamos la lista de deportes existentes al modal
      />
    </Container>
  );
};


