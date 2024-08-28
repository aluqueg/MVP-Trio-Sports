import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { TrioContext } from "../../../context/TrioContextProvider";
import { Col, Container, Row } from "react-bootstrap";
import { CardOneActivity } from "../../../components/CardOneActivity/CardOneActivity";
import { isBefore, parseISO } from "date-fns";
import ModalCreateComment from "../../../components/ModalCreateComment/ModalCreateComment";
import { useNavigate, useParams } from "react-router-dom";

export const OneUserParticipatedActivities = () => {

  const navigate = useNavigate();
  const {id} = useParams()
  const [filteredActivities, setFilteredActivities] = useState([]);
  const { user, token } = useContext(TrioContext);
  const [userActivities, setUserActivities] = useState([]);
  
  useEffect(()=>{
    const userActivities = async () => {
      try{
        let res = await axios.get(`http://localhost:4000/api/users/getOneUserParticipatedActivities/${id}`, {headers: {Authorization: `Bearer ${token}`}})
        
        setUserActivities(res.data); 
        setFilteredActivities(res.data); // Inicialmente, muestra todas las actividades

        console.log("la data", res.data);
               
      } catch (err) {
        console.log(err);
      }
    };
    userActivities();
  }, [token]);
  

   /* NECESARIO PARA LA CARD */
   const [showModal, setShowModal] = useState(false);
   const [selectedActivity, setSelectedActivity] = useState(null);
 
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
       // Envía el comentario al backend
       const response = await axios.post(
         "http://localhost:4000/api/comments/addComment",
         {
           activity_id: selectedActivity.activity_id,
           user_id: user.user_id, 
           text: comment,
         },
         {
           headers: { Authorization: `Bearer ${token}` }, // token
         }
       );
       if (response.status === 201) {
         // Redirige a la vista de la actividad
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
      console.log("Activity ID:", activityId);
      console.log("Token:", token);
  
      const response = await axios.put(
        "http://localhost:4000/api/activity/joinActivity",
        { activity_id: activityId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status === 200) {
        // Veriff estado actual desde el backend
        const updatedResponse = await axios.get(
          `http://localhost:4000/api/activity/getOneActivity/${activityId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        const updatedActivities = userActivities.map((activity) =>
          activity.activity_id === activityId
            ? { ...activity, num_asistants: activity.num_asistants + 1, is_user_participant: true }
            : activity
        );
      setUserActivities(updatedActivities);
      }
    } catch (error) {
      console.error("Error al unirse a la actividad:", error);
      // Reiniciar el estado de carga
      setUserActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activity.activity_id === activityId ? { ...activity, loading: false } : activity
        )
      );
    }
  };

  const handleLeaveActivity = async (activityId) => {
    try {
      console.log("Activity ID:", activityId); // Verificar activityId 
      // Desactiva temporalmente el botón
      setUserActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activity.activity_id === activityId ? { ...activity, loading: true } : activity
        )
      );
  
      const response = await axios.put(
        "http://localhost:4000/api/activity/leaveActivity",
        { activity_id: activityId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status === 200) {
        // Verificar el estado actual desde el backend
        const updatedResponse = await axios.get(
          `http://localhost:4000/api/activity/getOneActivity/${activityId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        const updatedActivities = userActivities.map((activity) =>
          activity.activity_id === activityId
            ? { ...updatedResponse.data, is_user_participant: false, loading: false }
            : activity
        );
        setUserActivities(updatedActivities);
      }
    } catch (error) {
      console.error("Error al abandonar la actividad:", error.response?.data || error.message);
     
      // Reiniciar el estado de carga
      setUserActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activity.activity_id === activityId ? { ...activity, loading: false } : activity
        )
      );
    }
  };



  return (
    <Container fluid={"md"}>
    <Row>
      <div className="d-flex flex-wrap gap-3">
        {!Array.isArray(userActivities) ? (
          <p>No hay actividades disponibles</p>
        ) : (
          userActivities.map((e) => (
            <CardOneActivity
              key={e.activity_id}
              activity={e}
              handleJoinActivity={handleJoinActivity}
              handleLeaveActivity={handleLeaveActivity} 
              isActivityFull={isActivityFull}
              isActivityPast={isActivityPast}
              getButtonLabel={getButtonLabel}
              getStatusLabel={getStatusLabel}
              handleShowModal={handleShowModal}
            />
          ))
        )}
      </div>
    </Row>
    <ModalCreateComment
      show={showModal}
      handleClose={handleCloseModal}
      handleCommentSubmit={handleCommentSubmit}
    />
  </Container>
  )
}