import { useEffect, useState } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import { format, parseISO, isBefore } from "date-fns";
import { es } from "date-fns/locale";
// Importa tu nuevo ícono
import SportsIcon from "../../assets/activities/iconodeportes.png";  // Ajusta la ruta según corresponda
import { BsMap, BsClock } from "react-icons/bs";
// Estilos
import "../AllActivities/allActivitiesStyle.css";

export const AllActivities = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/activity/getAllActivities"
        );
        setActivities(response.data);
      } catch (error) {
        if (error.response) {
          console.error("Error en la respuesta del servidor:", error.response.data);
        } else if (error.request) {
          console.error("Error en la solicitud:", error.request);
        } else {
          console.error("Error desconocido:", error.message);
        }
      }
    };

    fetchActivities();
  }, []);

  const getButtonLabel = (activity) => {
    if (activity.limit_users === null) {
      return "Unirse"; // Si no hay límite, solo muestra "Unirse"
    }
    const numAsistants = activity.num_asistants || 1; // El creador de la actividad ya está contado
    return `Unirse ${numAsistants} / ${activity.limit_users}`;
  };

  const isActivityFull = (activity) => {
    return activity.limit_users !== null && activity.num_asistants >= activity.limit_users;
  };

  const isActivityPast = (activityDate) => {
    const currentDateTime = new Date();
    return isBefore(activityDate, currentDateTime);
  };

  const getStatusLabel = (activity) => {
    const activityDate = parseISO(activity.date_time_activity);

    if (isActivityPast(activityDate)) {
      return "Finalizada";
    }

    if (isActivityFull(activity)) {
      return "Completa";
    }

    return null;
  };

  const handleJoinActivity = async (activityId) => {
    try {
      const response = await axios.put("http://localhost:4000/api/activity/joinActivity", {
        activity_id: activityId,
      });
      console.log(response.data);
      // Actualiza la lista de actividades después de unirse
      const updatedActivities = activities.map((activity) =>
        activity.activity_id === activityId
          ? { ...activity, num_asistants: activity.num_asistants + 1 }
          : activity
      );
      setActivities(updatedActivities);
    } catch (error) {
      console.error("Error al unirse a la actividad:", error);
    }
  };

  return (
    <Container>
      <Row>
        {activities
          .filter(activity => !isActivityPast(parseISO(activity.date_time_activity)))  // Filtra actividades no finalizadas
          .concat(activities.filter(activity => isActivityPast(parseISO(activity.date_time_activity))))  // Añade actividades finalizadas al final
          .map((activity) => {
            const activityDate = parseISO(activity.date_time_activity);
            const formattedDate = format(activityDate, "dd/MM/yyyy HH:mm", {
              locale: es,
            });
            const statusLabel = getStatusLabel(activity);

            return (
              <Col key={activity.activity_id} xs={12} md={6} className="mb-4">
                <Card className="flex-column flex-md-row h-100">
                  <Card.Img
                    src={`/src/assets/activities/${activity.sport_img}`}
                    alt={activity.text}
                    className="card-img-custom"
                    onError={(e) =>
                      (e.target.src = "/src/assets/activities/newsport.jpg")
                    } // imagen de fallback
                  />

                  <Card.Body>
                    {activity.text && <Card.Title>{activity.text}</Card.Title>}

                    <Card.Text>
                      <img src={SportsIcon} alt="Deportes" style={{ width: "24px", marginRight: "8px" }} /> {activity.sport_name}
                    </Card.Text>

                    <Card.Text>
                      <BsClock /> {formattedDate}
                    </Card.Text>

                    <Card.Text>
                      <BsMap /> {activity.activity_address},{" "}
                      {activity.activity_city}
                    </Card.Text>

                    {statusLabel && (
                      <Card.Text className={statusLabel === "Completa" ? "text-danger" : "text-muted"}>
                        <strong>{statusLabel}</strong>
                      </Card.Text>
                    )}

                    <Row className="mt-3">
                      <Col xs={12} md={6} className="mb-2 mb-md-0">
                        <Button
                          variant={
                            isActivityFull(activity) || isActivityPast(activityDate)
                              ? "danger"
                              : "primary"
                          }
                          className="w-100"
                          disabled={
                            isActivityFull(activity) || isActivityPast(activityDate)
                          }
                          onClick={() => handleJoinActivity(activity.activity_id)}  // Unirse a la actividad
                        >
                          {getButtonLabel(activity)}
                        </Button>
                      </Col>
                      <Col xs={12} md={6}>
                        <Button variant="secondary" className="w-100">
                          Añadir comentario
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
      </Row>
    </Container>
  );
};






