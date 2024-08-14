import { createContext, useState,useEffect } from "react"
import axios from 'axios'
import { jwtDecode } from "jwt-decode"

export const TrioContext = createContext()

export const TrioContextProvider = ({children}) => {

  const [user,setUser] = useState({})
  const [token,setToken] = useState();
  useEffect(()=>{
    const tokenLocal = localStorage.getItem("token")
    if(tokenLocal){
      const {id} = jwtDecode(tokenLocal);
      axios.get("http://localhost:3000/api/users/profile",{headers: {Authorization:`Bearer ${tokenLocal}`}})
      .then(res=>{
        setUser(res.data)
        setToken(tokenLocal)
      })
      .catch(err=>{
        console.log(err)
      })
    }
  },[])
  return (
    <>
      <TrioContext.Provider value={{user,setUser,token,setToken}}>
        {children}
      </TrioContext.Provider>
    </>
  )
}
