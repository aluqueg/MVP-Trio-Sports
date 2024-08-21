import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { TrioContext } from "../../../context/TrioContextProvider";

export const UserActivities = () => {
  const { token } = useContext(TrioContext);
  const [userActivities, setUserActivities] = useState({});

  useEffect(()=>{
    const userActivities = async () => {
      try{
        let res = await axios.get('http://localhost:4000/api/users/getUserActivities', {headers: {Authorization: `Bearer ${token}`}})

        setUserActivities(res);
      }catch(err){
        console.log(err)
      }
    }
    userActivities();
  },[])
  console.log("userActivities", userActivities)
  return (
    <div>UserActivities</div>
  )
}
