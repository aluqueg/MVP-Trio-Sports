import { useEffect, useState } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
//iconos
import { MdSportsSoccer } from "react-icons/md";
import { BsMap, BsClock } from "react-icons/bs";
//estilos
import "./allActivitiesStyle.css";

export const AllActivities = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/activity/getAllActivities"
        );
        console.log(response.data);
        setActivities(response.data);
      } catch (error) {
        console.error("Error al cargar las actividades:", error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <Container>
      <Row>
        {activities.map((activity) => {
          const activityDate = parseISO(activity.date_time_activity);
          const formattedDate = format(activityDate, "dd/MM/yyyy HH:mm", {
            locale: es,
          });

          return (
            <Col key={activity.activity_id} xs={12} md={6} className="mb-4">
              <Card className="flex-column flex-md-row h-100">
                <Card.Img
                  src={`http://localhost:4000/images/activities/${activity.sport_img}`}
                  alt={activity.text}
                  className="card-img-custom"
                />

                <Card.Body>
                  <Card.Title>{activity.text}</Card.Title>

                  <Card.Text>
                    <MdSportsSoccer /> {activity.sport_name}
                  </Card.Text>

                  <Card.Text>
                    <BsClock /> {formattedDate}
                  </Card.Text>

                  <Card.Text>
                    <BsMap /> {activity.activity_address}, {activity.activity_city}
                  </Card.Text>

                  <Card.Text>
                    <strong>Participantes:</strong>{" "}
                    {activity.limit_users || "Sin límite"}
                  </Card.Text>
                  <Row className="mt-3">
                    <Col xs={12} md={6} className="mb-2 mb-md-0">
                      <Button variant="primary" className="w-100">
                        Unirse
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
