import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Table, Button, Form } from "react-bootstrap";
import axios from "axios";
import { BsTrophy, BsMap, BsClock, BsCalendar3 } from "react-icons/bs";
import { MdLocationOn } from "react-icons/md";
import "../Activity/activityStyle.css";

export const Activity = () => {
  const { activity_id } = useParams();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/activity/getOneActivity/${activity_id}`
        );
        setActivity(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error al cargar la actividad");
        setLoading(false);
      }
    };

    fetchActivity();
  }, [activity_id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() !== "") {
      const comment = {
        user: "Usuario", // Simulación de usuario 
        text: newComment,
        date: new Date(),
      };
      setComments([comment, ...comments]); // Añadir el nuevo comentario al inicio de la lista
      setNewComment(""); // Limpiar el campo de texto
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container fluid className="activity-container">
      {/* Título centrado */}
      <Row className="justify-content-center">
        <h2 className="activity-title">{activity.text}</h2>
      </Row>
      
      {/* Imagen a la izquierda y tabla con información a la derecha */}
      <Row className="align-items-center justify-content-center activity-content">
        <Col xs={12} md={6} className="activity-image-col">
          <img
            src={`/src/assets/activities/${activity.sport_img}`}
            alt={activity.sport_name}
            className="activity-image"
            onError={(e) =>
              (e.target.src = "/src/assets/activities/newsport.jpg")
            }
          />
        </Col>
        <Col xs={12} md={6} className="activity-details-wrapper">
          <Table borderless className="activity-table">
            <tbody>
              <tr className="table-separator">
                <td>
                  <BsTrophy className="icon" />
                </td>
                <td className="text-large">{activity.sport_name}</td>
              </tr>
              <tr className="table-separator">
                <td>
                  <BsMap className="icon" />
                </td>
                <td className="text-large">
                  {activity.activity_address}, {activity.activity_city}
                </td>
              </tr>
              <tr className="table-separator">
                <td>
                  <BsCalendar3 className="icon" />
                </td>
                <td className="text-large">
                  {new Date(activity.date_time_activity).toLocaleDateString(
                    "es-ES"
                  )}
                </td>
              </tr>
              <tr className="table-separator">
                <td>
                  <BsClock className="icon" />
                </td>
                <td className="text-large">
                  {new Date(activity.date_time_activity).toLocaleTimeString(
                    "es-ES",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </td>
              </tr>
              <tr className="table-separator">
                <td>
                  <MdLocationOn
                    className="icon"
                    style={{ color: "#EA4335" }}
                  />
                </td>
                <td className="text-large">
                  <a
                    href={activity.maps_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver en Google Maps
                  </a>
                </td>
              </tr>
            </tbody>
          </Table>
          <div className="activity-info-box">
            <p className="activity-info-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </Col>
      </Row>
      
      {/* Botones */}
      <Row className="justify-content-center mt-4">
        <Col xs={12} md={8} className="activity-buttons">
          <Button variant="primary" className="me-2 btn-large">
            Unirse 1/2
          </Button>
          <Button variant="secondary" className="btn-large">
            Añadir comentario
          </Button>
        </Col>
      </Row>
      
      {/* Comentarios */}
      <Row className="justify-content-center mt-4">
        <Col xs={12} md={8}>
          <Form onSubmit={handleCommentSubmit} className="d-flex">
            <Form.Control
              type="text"
              placeholder="Deja aquí tu comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="me-2"
            />
            <Button type="submit" variant="primary">
              Enviar
            </Button>
          </Form>
        </Col>
      </Row>
      <Row className="justify-content-center mt-4">
        <Col xs={12} md={8}>
          {comments.map((comment, index) => (
            <div key={index} className="comment-box mb-3 p-3">
              <div className="comment-header d-flex justify-content-between">
                <strong>{comment.user}</strong>
                <span>
                  {new Date(comment.date).toLocaleDateString("es-ES")}{" "}
                  {new Date(comment.date).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="comment-text">{comment.text}</div>
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
};










