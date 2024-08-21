import React, { useContext, useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TrioContext } from "../../context/TrioContextProvider";
import { parseISO, isBefore } from "date-fns";
import { CardOneActivity } from "../../components/CardOneActivity/CardOneActivity";
import { ActivityFilter } from "../../components/ActivityFilter/ActivityFilter";
import ModalCreateComment from "../../components/ModalCreateComment/ModalCreateComment";
import "../AllActivities/allActivitiesStyle.css";

export const AllActivities = () => {
  const { token, user } = useContext(TrioContext);
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/activity/getAllActivities",
          {
            headers: { Authorization: `Bearer ${token}` }, // token
          }
        );
        setActivities(response.data);
        setFilteredActivities(response.data); // Inicialmente, muestra todas las actividades
      } catch (error) {
        console.error("Error al cargar actividades:", error);
      }
    };

    if (token) {
      fetchActivities();
    }
  }, [token]);
  const handleFilter = (filters) => {
    const filtered = activities.filter((activity) => {
      const normalizedActivityCity = activity.activity_city
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
  
      const matchesSport = filters.sport ? activity.sport_name === filters.sport : true;
      const matchesCity = filters.city ? normalizedActivityCity.includes(filters.city.toLowerCase()) : true;
  
      const activityDate = new Date(activity.date_time_activity.split(" ")[0]);
      const filterDate = new Date(filters.date);
  
      // Comparar rango de fechas
      const matchesDate = filters.date ? activityDate >= filterDate : true;
  
      return matchesSport && matchesCity && matchesDate;
    });
  
    setFilteredActivities(filtered);
  };
  
  
  

  const handleReset = () => {
    setFilteredActivities(activities); // Restablecer todas las actividades
  };

  const handleShowModal = (activity) => {
    setSelectedActivity(activity);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedActivity(null);
  };

  const handleCommentSubmit = async (comment) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/comments/addComment",
        {
          activity_id: selectedActivity.activity_id,
          user_id: user.user_id, // user_id
          text: comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // token
        }
      );
  
      if (response.status === 201) {
        navigate(`/activity/${selectedActivity.activity_id}`);
      } else {
        console.error("Error al crear el comentario");
      }
    } catch (error) {
      console.error("Error al enviar el comentario:", error);
    }
  };

  const getButtonLabel = (activity) => {
    if (activity.limit_users === null) {
      return "Unirse";
    }
    const numAsistants = activity.num_asistants || 1;
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
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // token
        }
      );
      const updatedActivities = activities.map((activity) =>
        activity.activity_id === activityId
          ? { ...activity, num_asistants: activity.num_asistants + 1 }
          : activity
      );
      setFilteredActivities(updatedActivities);
    } catch (error) {
      console.error("Error al unirse a la actividad:", error);
    }
  };

  return (
    <Container>
    {/* Filtro de actividades */}
    <ActivityFilter onFilter={handleFilter} onReset={handleReset} />
    <div className="custom-divider"></div>
    {/* Actividades filtradas */}
    <Row>
      {filteredActivities.map((activity) => (
        <CardOneActivity
          key={activity.activity_id}
          activity={activity}
          handleJoinActivity={handleJoinActivity}
          isActivityFull={isActivityFull}
          isActivityPast={isActivityPast}
          getButtonLabel={getButtonLabel}
          getStatusLabel={getStatusLabel}
          handleShowModal={handleShowModal}
        />
      ))}
    </Row>
 
    {/* Modal para añadir comentarios */}
    <ModalCreateComment
      show={showModal}
      handleClose={handleCloseModal}
      handleCommentSubmit={handleCommentSubmit}
    />
  </Container>
 
  );
};
