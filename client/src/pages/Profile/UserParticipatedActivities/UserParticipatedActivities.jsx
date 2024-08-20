import { useContext, useEffect, useState } from 'react'
import { TrioContext } from "../../../context/TrioContextProvider";
import axios from 'axios';

export const UserParticipatedActivities = ({participated}) => {
  const { token } = useContext(TrioContext);
  const [userParticipatedActivities, setUserParticipatedActivities] = useState({});

  console.log("participatedActivities", participated);
  
  useEffect(()=>{
    const userParticipated = async () => {
      try{
        let res = await axios.get('http://localhost:4000/api/users/getUserParticipatedActivities', {headers: {Authorization: `Bearer ${token}`}})

        setUserParticipatedActivities(res);
      }catch(err){
        console.log(err)
      }
    }
    userParticipated();
  },[])

  console.log("userParticipated", userParticipatedActivities)
  return (
    <div>UserParticipatedActivities</div>
  )
}
