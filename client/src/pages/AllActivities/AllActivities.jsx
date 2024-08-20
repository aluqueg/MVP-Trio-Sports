import React, { useContext, useEffect, useState } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { es } from 'date-fns/locale';
import { TrioContext } from "../../context/TrioContextProvider";
import { format, parseISO, isBefore } from "date-fns";
import { CardOneActivity } from "../../components/CardOneActivity/CardOneActivity";
import "../AllActivities/allActivitiesStyle.css";

export const AllActivities = () => {
  const {sports, setSports} = useContext(TrioContext)
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
          console.error(
            "Error en la respuesta del servidor:",
            error.response.data
          );
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
    return (
      activity.limit_users !== null &&
      activity.num_asistants >= activity.limit_users
    );
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
      const response = await axios.put(
        "http://localhost:4000/api/activity/joinActivity",
        {
          activity_id: activityId,
        }
      );
      console.log(response.data);
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
          .filter(
            (activity) => !isActivityPast(parseISO(activity.date_time_activity))
          )
          .concat(
            activities.filter((activity) =>
              isActivityPast(parseISO(activity.date_time_activity))
            )
          )
          .map((activity) => (
            <CardOneActivity
              key={activity.activity_id}
              activity={activity}
              handleJoinActivity={handleJoinActivity}
              isActivityFull={isActivityFull}
              isActivityPast={isActivityPast}
              getButtonLabel={getButtonLabel}
              getStatusLabel={getStatusLabel}
            />
          ))}
      </Row>
    </Container>
  );
};
