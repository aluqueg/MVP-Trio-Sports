import React, { useContext, useEffect, useState } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { TrioContext } from "../../context/TrioContextProvider";


export const AllActivities = () => {
  const {sports, setSports} = useContext(TrioContext)
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/activity/getAllActivities");
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
          // Convertir la fecha almacenada en la base de datos en un objeto de fecha
          const activityDate = parseISO(activity.date_time_activity);
          // Formatear la fecha y hora para mostrarla en la card en formato español
          const formattedDate = format(activityDate, 'dd/MM/yyyy HH:mm', { locale: es });

          return (
            <Col key={activity.activity_id} sm={12} md={6} lg={4} className="mb-4">
              <Card>
                {/* Corrige la referencia al campo sport_img */}
                <Card.Img variant="top" src={`http://localhost:4000/images/activities/${activity.sport_img}`} alt={activity.text} />


                <Card.Body>
                  {/* Título */}
                  <Card.Title>{activity.text}</Card.Title>
                  
                  {/* Deporte */}
                  <Card.Text><strong>Deporte:</strong> {activity.sport_name}</Card.Text>
                  
                  {/* Fecha y Hora */}
                  <Card.Text><strong>Fecha y Hora:</strong> {formattedDate}</Card.Text>
                  
                  {/* Dirección */}
                  <Card.Text><strong>Dirección:</strong> {activity.activity_address}</Card.Text>
                  
                  {/* Google Maps Link (mostrar solo si está disponible) */}
                  {activity.maps_link && (
                    <Card.Text>
                      <strong>Ubicación:</strong> <a href={activity.maps_link} target="_blank" rel="noopener noreferrer">Ver en Google Maps</a>
                    </Card.Text>
                  )}
                  
                  {/* Descripción (mostrar solo si está disponible) */}
                  {activity.details && (
                    <Card.Text><strong>Descripción:</strong> {activity.details}</Card.Text>
                  )}
                  
                  {/* Número de Participantes */}
                  <Card.Text><strong>Participantes:</strong> {activity.limit_users || "Sin límite"}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

