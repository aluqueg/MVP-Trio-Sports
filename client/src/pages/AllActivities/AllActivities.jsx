import { useContext, useEffect, useState } from "react";
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

  //filtros deportes, fecha, ciudad

  const handleFilter = (filters) => {
    const filtered = activities.filter((activity) => {
      const normalizedActivityCity = activity.activity_city
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

      const matchesSport = filters.sport
        ? activity.sport_name === filters.sport
        : true;
      const matchesCity = filters.city
        ? normalizedActivityCity.includes(filters.city.toLowerCase())
        : true;

      const activityDate = new Date(activity.date_time_activity.split(" ")[0]);
      let filterDate = filters.date ? new Date(filters.date) : null;

      activityDate.setHours(0, 0, 0, 0);

      // Sumar un día a la filterDate para ajustar la diferencia
      if (filterDate) {
        filterDate.setDate(filterDate.getDate() + 1);
        filterDate.setHours(0, 0, 0, 0);
      }

      console.log("Activity Date:", activityDate);
      console.log("Filter Date:", filterDate);

      const matchesDate = filters.date
        ? activityDate.getTime() === filterDate?.getTime()
        : true;

      console.log("Matches Date:", matchesDate);

      return matchesSport && matchesCity && matchesDate;
    });

    console.log("Filtered Activities:", filtered);
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

  const isActivityFull = (activity) => {
    console.log(activity);
    console.log(activity.limit_users);
    console.log(activity.num_assistants);
    let res =
      activity.limit_users !== null &&
      activity.num_assistants >= activity.limit_users;
    console.log(res);
    return res;
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

  // Lógica para unirse a la actividad
  const handleJoinActivity = async (activityId) => {
    console.log("JOINNNNNNNNN", activityId);
    try {
      const response = await axios.put(
        "http://localhost:4000/api/activity/joinActivity",
        { activity_id: activityId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setFilteredActivities((prevActivities) =>
          prevActivities.map((activity) =>
            activity.activity_id === activityId
              ? {
                  ...activity,
                  num_assistants: activity.num_assistants + 1,
                  is_user_participant: true,
                }
              : activity
          )
        );
      }
    } catch (error) {
      console.error(
        "Error al unirse a la actividad:",
        error.response?.data || error.message
      );
    }
  };

  // Lógica para abandonar la actividad
  const handleLeaveActivity = async (activityId) => {
    console.log("holaaaaa", activityId);

    try {
      console.log("hola");
      const response = await axios.put(
        "http://localhost:4000/api/activity/leaveActivity",
        { activity_id: activityId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setFilteredActivities((prevActivities) =>
          prevActivities.map((activity) =>
            activity.activity_id === activityId
              ? {
                  ...activity,
                  num_assistants: Math.max(activity.num_assistants - 1, 0),
                  is_user_participant: false,
                }
              : activity
          )
        );
      }
    } catch (error) {
      console.error(
        "Error al abandonar la actividad:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <Container>
      {/* Filtro de actividades */}
      <ActivityFilter onFilter={handleFilter} onReset={handleReset} />
      <div className="custom-divider"></div>
      {/* Actividades filtradas */}
      <Row>
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <CardOneActivity
              key={activity.activity_id}
              activity={activity}
              handleJoinActivity={handleJoinActivity}
              handleLeaveActivity={handleLeaveActivity}
              isActivityFull={isActivityFull}
              isActivityPast={isActivityPast}
              getStatusLabel={getStatusLabel}
              handleShowModal={handleShowModal}
            />
          ))
        ) : (
          <p className="no-results-message">
            No hay actividades disponibles para los criterios de búsqueda.
          </p>
        )}
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
