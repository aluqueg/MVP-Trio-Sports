import { Card, Row, Col, Button } from "react-bootstrap";
import { BsTrophy, BsMap, BsCalendar3, BsPencil } from "react-icons/bs";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export const CardOneActivity = ({
  activity,
  handleJoinActivity,
  handleLeaveActivity,
  isActivityFull,
  isActivityPast,
  getStatusLabel,
  handleShowModal,
  showEditButton,
}) => {
  const activityDate = parseISO(activity.date_time_activity);
  const formattedDate = format(activityDate, "dd/MM/yyyy HH:mm", {
    locale: es,
  });
  const statusLabel = getStatusLabel(activity);

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const getJoinButtonText = () => {
    if (activity.is_user_participant) {
      return "Abandonar";
    } else if (activity.limit_users) {
      return `Unirse ${activity.num_assistants}/${activity.limit_users}`;
    } else {
      return "Unirse";
    }
  };

  const truncatedTitle = truncateText(activity.text, 50);
  const truncatedAddress = truncateText(activity.activity_address, 30);
  const truncatedCity = truncateText(activity.activity_city, 20);

  return (
    <Col xs={12} md={6} className="mb-4">
      <Card className="flex-column flex-md-row h-100 position-relative">
        <Link
          to={`/activity/${activity.activity_id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Card.Img
            src={`/src/assets/activities/${activity.sport_img}`}
            alt={activity.text}
            className="card-img-custom"
            onError={(e) =>
              (e.target.src = "/src/assets/activities/newsport.jpg")
            } // Reemplazar imagen si falla la carga
          />
        </Link>

        {/* Ícono de lápiz siempre visible si el usuario es el creador */}
        {showEditButton && !isActivityPast(activityDate) && (
          <Link
            to={`/editActivity/${activity.activity_id}`}
            className="position-absolute"
            style={{
              top: "10px",
              right: "10px",
              backgroundColor: "white",
              borderRadius: "50%",
              padding: "5px",
              border: "1px solid #ccc", // Borde gris claro para destacar el fondo blanco
            }}
            onClick={(e) => e.stopPropagation()} // Evita que el enlace a la actividad se active
          >
            <BsPencil
              style={{
                cursor: "pointer",
                width: "24px",
                height: "24px",
                color: "gray", // Color gris para el ícono
                transition: "color 0.3s ease", // Efecto suave al pasar el ratón
              }}
              onMouseOver={(e) => (e.target.style.color = "#000")} // Cambiar a negro al pasar el ratón
              onMouseOut={(e) => (e.target.style.color = "gray")} // Restaurar color al salir del ratón
            />
          </Link>
        )}

        <Card.Body className="d-flex flex-column">
          {activity.text && <Card.Title>{truncatedTitle}</Card.Title>}

          <Card.Text>
            <BsTrophy /> {activity.sport_name}
          </Card.Text>

          <Card.Text>
            <BsCalendar3 /> {formattedDate}
          </Card.Text>

          <Card.Text>
            <BsMap /> {truncatedAddress}, {truncatedCity}
          </Card.Text>

          {statusLabel && (
            <Card.Text
              className={
                statusLabel === "Completa" ? "text-danger" : "text-muted"
              }
            >
              <strong>{statusLabel}</strong>
            </Card.Text>
          )}

          <div style={{ flexGrow: 1 }}></div>

          <Row className="mt-3">
            <Col xs={12} md={6} className="mb-2 mb-md-0">
              <Button
                variant={
                  isActivityFull(activity) || isActivityPast(activityDate)
                    ? "danger"
                    : activity.is_user_participant || activity.is_creator
                    ? "secondary"
                    : "primary"
                }
                className="w-100"
                disabled={
                  isActivityFull(activity) ||
                  isActivityPast(activityDate) ||
                  activity.loading
                } // Deshabilita mientras carga o si la actividad está completa/pasada
                onClick={(e) => {
                  e.preventDefault();
                  if (!activity.loading) {
                    // Solo permite clic si no está cargando
                    if (activity.is_user_participant || activity.is_creator) {
                      handleLeaveActivity(activity.activity_id);
                    } else {
                      handleJoinActivity(activity.activity_id);
                    }
                  }
                }}
              >
                {getJoinButtonText()}
              </Button>
            </Col>
            <Col xs={12} md={6}>
              <Button
                variant="secondary"
                className="w-100"
                onClick={(e) => {
                  e.preventDefault();
                  handleShowModal(activity);
                }}
              >
                Añadir comentario
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
};

