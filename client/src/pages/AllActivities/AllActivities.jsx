import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import axios from "axios";

export const AllActivities = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/activity/getAllActivities");
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
        {activities.map((activity) => (
          <Col key={activity.activity_id} sm={12} md={6} lg={4} className="mb-4">
            <Card>
              {/* Asegúrate de que la imagen se cargue desde el campo sport_img */}
              <Card.Img variant="top" src={`images/${activity.sport_img}`} alt={activity.text} />
              <Card.Body>
                <Card.Title>{activity.text}</Card.Title>
                <Card.Text>
                  Ciudad: {activity.activity_city}
                  <br />
                  Fecha y Hora: {new Date(activity.date_time_activity).toLocaleString()}
                  <br />
                  Participantes: {activity.limit_users || "Sin límite"}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};
