import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Container, Alert, Row, Col } from "react-bootstrap";
import { BsCalendar3 } from "react-icons/bs";
import axios from "axios";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes } from "date-fns";
import { es } from "date-fns/locale";
import { ModalCreateSport } from "../../components/ModalCreateSport/ModalCreateSport";
import { TrioContext } from "../../context/TrioContextProvider";
import "../AddActivity/addActivityStyle.css";

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
      axios
        .get("http://localhost:4000/api/sports/allSports", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setSports(res.data);
        })
        .catch((error) => {
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
      const month = String(dateTimeActivity.getMonth() + 1).padStart(2, "0");
      const day = String(dateTimeActivity.getDate()).padStart(2, "0");
      const hours = String(dateTimeActivity.getHours()).padStart(2, "0");
      const minutes = String(dateTimeActivity.getMinutes()).padStart(2, "0");
      const seconds = "00";

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
          maps_link: mapsLink || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
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
    <Container
      fluid="xxl"
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="w-100 container-add-activity"
        style={{ maxWidth: "600px", padding: "20px" }}
      >
        <h3 className="text-center mb-4">
          Formulario de creación de una actividad
        </h3>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <div className="add-activity-custom-divider"></div>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formText" className="mb-3">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              placeholder="Introduce el título de la actividad"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              className="form-input"
            />
          </Form.Group>

          <Row className="mb-3">
            <Col>
              <Form.Group controlId="formSportId">
                <Form.Label>Deporte</Form.Label>
                <Form.Select
                  value={sportId}
                  onChange={(e) => {
                    if (e.target.value === "addSport") {
                      setShowModal(true);
                    } else {
                      setSportId(e.target.value);
                    }
                  }}
                  required
                  className="form-select"
                >
                  <option value="">Elegir deporte...</option>
                  {sports.map((sport) => (
                    <option key={sport.sport_id} value={sport.sport_id}>
                      {sport.sport_name}
                    </option>
                  ))}
                  <option value="addSport">Añadir nuevo deporte</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formLimitUsers">
                <Form.Label>Número de participantes</Form.Label>
                <Form.Control
                  type="number"
                  value={limitUsers}
                  onChange={(e) =>
                    setLimitUsers(e.target.value < 0 ? 0 : e.target.value)
                  }
                  className="form-input"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="formDateTimeActivity" className="mb-3">
            <Form.Label>Día y hora</Form.Label>
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
                placeholderText="Selecciona el día y la hora"
                className="form-control add-activity-datepicker form-datepicker"
                required
              />
              <BsCalendar3 className="add-activity-calendar-icon" />
            </div>
          </Form.Group>

          <Form.Group controlId="formActivityCity" className="mb-3">
            <Form.Label>Ciudad</Form.Label>
            <Form.Control
              type="text"
              placeholder="Introduce la ciudad donde se realizará la actividad"
              value={activityCity}
              onChange={(e) => setActivityCity(e.target.value)}
              required
              className="form-input"
            />
          </Form.Group>

          <Form.Group controlId="formActivityAddress" className="mb-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              placeholder="Introduce la dirección donde se realizará la actividad"
              value={activityAddress}
              onChange={(e) => setActivityAddress(e.target.value)}
              required
              className="form-input"
            />
          </Form.Group>

          <Form.Group controlId="formMapsLink" className="mb-3">
            <Form.Label>Enlace de Google Maps</Form.Label>
            <Form.Control
              type="url"
              placeholder="Introduce el enlace de Google Maps"
              value={mapsLink}
              onChange={(e) => setMapsLink(e.target.value)}
              className="form-input"
            />
          </Form.Group>

          <Form.Group controlId="formDetails" className="mb-3">
            <Form.Label>Descripción breve</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Introduce una breve descripción de la actividad"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              maxLength={255}
              className="form-input"
            />
            <Form.Text className="text-muted">
              {`${details.length}/255 caracteres`}
            </Form.Text>
          </Form.Group>

          <div className="add-activity-custom-divider"></div>

          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="trio-cancel-btn me-2"
              onClick={handleCancel}
            >
              Cancelar
            </button>
            <button type="submit" className="trio-btn">
              Crear Actividad
            </button>
          </div>
        </Form>

        {/* Modal para crear un nuevo deporte */}
        <ModalCreateSport
          show={showModal}
          closeModal={() => setShowModal(false)}
          onSportCreated={handleSportCreated}
          existingSports={sports}
        />
      </div>
    </Container>
  );
};
