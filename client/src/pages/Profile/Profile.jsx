import { useContext, useEffect } from "react";
import { TrioContext } from "../../context/TrioContextProvider";
export const Profile = () => {
  const { user, setUser , setToken} = useContext(TrioContext);
  
  return (
    <>
    {user.user_name}
    </>
  )
}
