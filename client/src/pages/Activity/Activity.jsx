import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Table, Button, Image } from "react-bootstrap";
import axios from "axios";
import { BsTrophy, BsMap, BsClock, BsCalendar3 } from "react-icons/bs";
import { MdLocationOn } from "react-icons/md";
import { TrioContext } from "../../context/TrioContextProvider";
import "../Activity/activityStyle.css";
import ModalCreateComment from "../../components/ModalCreateComment/ModalCreateComment";

export const Activity = () => {
  const { token, user } = useContext(TrioContext);
  const { activity_id } = useParams();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (token) {
      const fetchActivity = async () => {
        try {
          const activityResponse = await axios.get(
            `http://localhost:4000/api/activity/getOneActivity/${activity_id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const commentsResponse = await axios.get(
            `http://localhost:4000/api/comments/getCommentsByActivity/${activity_id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setActivity(activityResponse.data);
          setComments(
            commentsResponse.data.map((comment) => ({
              ...comment,
              user: {
                user_name: comment.user_name || "Usuario desconocido",
                user_img: comment.user_img || "default_user_img.png",
              },
            }))
          );
          setLoading(false);
        } catch (error) {
          setError("Error al cargar la actividad");
          setLoading(false);
        }
      };

      fetchActivity();
    }
  }, [activity_id, token]);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Manejo del estado de la imagen de usuario
  const [fallbackImage, setFallbackImage] = useState(
    "/src/assets/images/default_user_img.png"
  );

  const handleImageError = () => {
    setFallbackImage("/src/assets/images/default_user_img.png");
  };

  const handleCommentSubmit = async (commentText) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/comments/addComment",
        {
          activity_id,
          user_id: user.user_id,
          text: commentText,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        const newComment = {
          user_name: user.user_name,
          user_img: user.user_img || "default_user_img.png",
          text: commentText,
          date: new Date(),
        };
        setComments([newComment, ...comments]);
        handleCloseModal();
      } else {
        console.error("Error al crear el comentario");
      }
    } catch (error) {
      console.error("Error al enviar el comentario:", error);
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
              {/* No mostrar maps_link si es null */}
              {activity.maps_link && (
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
              )}
            </tbody>
          </Table>
          <div className="activity-info-box">
            <p className="activity-info-text">
              {activity.details ||
                "No hay detalles adicionales para esta actividad."}
            </p>
          </div>
        </Col>
      </Row>
      {/* Botones */}
      <Row className="justify-content-center mt-4">
        <Col xs={12} md={8} className="activity-buttons">
          <Button variant="primary" className="me-2 btn-large">
            Unirse {activity.num_assistants} /{" "}
            {activity.limit_users || "Sin límite"}
          </Button>
          <Button
            variant="secondary"
            className="btn-large"
            onClick={handleOpenModal}
          >
            Añadir comentario
          </Button>
        </Col>
      </Row>
      <hr />
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
                <div className="d-flex align-items-center">
                  <Image
                    src={
                      comment.user_img
                        ? `http://localhost:4000/images/users/${comment.user_img}`
                        : fallbackImage
                    }
                    roundedCircle
                    style={{
                      width: "30px",
                      height: "30px",
                      marginRight: "10px",
                    }}
                    onError={(e) => {
                      e.target.onerror = null; // Evitar loops infinitos si la imagen de fallback también falla
                      e.target.src = fallbackImage;
                    }}
                  />
                  <strong>{comment.user_name}</strong>
                </div>
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
