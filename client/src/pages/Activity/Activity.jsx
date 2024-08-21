import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import axios from "axios";
import { BsTrophy, BsMap, BsClock, BsCalendar3 } from "react-icons/bs";
import { MdLocationOn } from "react-icons/md";
import "../Activity/activityStyle.css";
import ModalCreateComment from "../../components/ModalCreateComment/ModalCreateComment";

export const Activity = () => {
  const { activity_id } = useParams();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const activityResponse = await axios.get(
          `http://localhost:4000/api/activity/getOneActivity/${activity_id}`
        );
        const commentsResponse = await axios.get(
          `http://localhost:4000/api/comments/getCommentsByActivity/${activity_id}`
        );

        setActivity(activityResponse.data);
        setComments(commentsResponse.data); // Cargar comentarios desde la base de datos
        setLoading(false);
      } catch (error) {
        setError("Error al cargar la actividad");
        setLoading(false);
      }
    };

    fetchActivity();
  }, [activity_id]);

  const handleCommentSubmit = async (commentText) => {
    try {
      // Envía el comentario al backend para guardarlo en la base de datos
      const response = await axios.post(
        "http://localhost:4000/api/comments/addComment",
        {
          activity_id: activity_id,
          text: commentText,
        }
      );

      if (response.status === 201) {
        // Si se guarda el comentario, actualiza la lista de comentarios
        const newComment = {
          user: "Usuario", // Simulación de usuario 
          text: commentText,
          date: new Date(),
        };
        setComments([newComment, ...comments]);
        setShowModal(false); // Cerrar el modal
      } else {
        console.error("Error al crear el comentario");
      }
    } catch (error) {
      console.error("Error al enviar el comentario:", error);
    }
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

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
            Unirse 1 / 2
          </Button>
          <Button variant="secondary" className="btn-large" onClick={handleOpenModal}>
            Añadir comentario
          </Button>
        </Col>
      </Row>

      {/* Modal para añadir comentario */}
      <ModalCreateComment
        show={showModal}
        handleClose={handleCloseModal}
        handleCommentSubmit={handleCommentSubmit}
      />
      
      {/* Comentarios */}
      <Row className="justify-content-center mt-4">
        <Col xs={12}>
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












