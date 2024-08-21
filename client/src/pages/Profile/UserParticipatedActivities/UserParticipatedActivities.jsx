import { useContext, useEffect, useState } from 'react'
import { TrioContext } from "../../../context/TrioContextProvider";
import axios from 'axios';
import { Container, Row } from 'react-bootstrap';
import ModalCreateComment from "../../../components/ModalCreateComment/ModalCreateComment";
import { isBefore, parseISO } from 'date-fns';
import { CardOneActivity } from '../../../components/CardOneActivity/CardOneActivity';

export const UserParticipatedActivities = ({participated}) => {
  const { token } = useContext(TrioContext);
  const [userParticipatedActivities, setUserParticipatedActivities] = useState([]);

  console.log("participatedActivities", participated);
  
  useEffect(()=>{
    const userParticipated = async () => {
      try{
        let res = await axios.get('http://localhost:4000/api/users/getUserParticipatedActivities', {headers: {Authorization: `Bearer ${token}`}})

        setUserParticipatedActivities(res.data);
      }catch(err){
        console.log(err)
      }
    }
    userParticipated();
  },[])

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
      const response = await axios.post("http://localhost:4000/api/comments/addComment", {
        activity_id: selectedActivity.activity_id,
        text: comment,
      });
  
      if (response.status === 201) {
        // Si el comentario se ha guardado correctamente, redirige a la vista de la actividad
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

  console.log("userParticipated", userParticipatedActivities)
  return (
    <Container>
            <Row>
          <div className="d-flex justify-content-center flex-wrap gap-3">
            {!Array.isArray(userParticipatedActivities) ? <p>No hay actividades disponibles</p> : userParticipatedActivities.map((e)=><CardOneActivity
              key={e.activity_id}
              activity={e}
              handleJoinActivity={handleJoinActivity}
              isActivityFull={isActivityFull}
              isActivityPast={isActivityPast}
              getButtonLabel={getButtonLabel}
              getStatusLabel={getStatusLabel}
              handleShowModal={handleShowModal}
            />)}
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
