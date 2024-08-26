import { useEffect, useContext, useState } from 'react'
import axios from 'axios'
import { TrioContext } from "../../../context/TrioContextProvider";

export const AdminUsers = () => {
  const [userList,setUserList] = useState()
  useEffect(()=>{
    axios.get("http://localhost:4000/api/admin/getAllUsers")
      .then(res=>{
        setUserList(res.data)
      })
      .catch(error =>{
        console.log("error")
      })
  },[])
  
  const getAllUsers = async () =>{
    try{
      const res =await axios.get("http://localhost:4000/api/admin/getAllUsers")
      setUserList(res.data)
    }catch(err){
      console.log(err)
    }
  }

  const disableUser = (id,is_disabled) =>{
    axios.put("http://localhost:4000/api/admin/disableUser",{user_id: id, status: is_disabled})
      .then(res =>{
        console.log(res.data)
        getAllUsers()
      })
      .catch(error =>{
        console.log(error)
      })
  }
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
