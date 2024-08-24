import { useEffect, useContext, useState } from 'react'
import axios from 'axios'
import { TrioContext } from "../../context/TrioContextProvider";


export const Admin = () => {
  const { user, token } = useContext(TrioContext);
  const [userList,setUserList] = useState()
  console.log(user)
  useEffect(()=>{
    axios.get("http://localhost:4000/api/users/getAllUsersAdmin")
      .then(res=>{
        setUserList(res.data)
      })
      .catch(error =>{
        console.log(error)
      })
  },[])

  const getAllUsers = async () =>{
    try{
      const res =await axios.get("http://localhost:4000/api/users/getAllUsersAdmin")
      setUserList(res.data)
    }catch(err){
      console.log(err)
    }
  }

  const disableUser = (id,is_disabled) =>{
    axios.put("http://localhost:4000/api/users/disableUser",{user_id: id, status: is_disabled})
      .then(res =>{
        console.log(res.data)
        getAllUsers()
      })
      .catch(error =>{
        console.log(error)
      })
  }
  console.log(userList)
  return (
    <div>
      {userList?.map((e)=>{
        return(
          <div>{e.user_name} <button onClick={()=>disableUser(e.user_id,e.is_disabled)}>{e.is_disabled === 0 ? "deshabilitar" : "habilitar"}</button></div>
        )
      })}

    </div>
  )
}
