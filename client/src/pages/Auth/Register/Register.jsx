import { useState } from "react"
import { Outlet } from "react-router-dom"

export const Register = () => { 
  const [userRegister,setUserRegister] = useState({})
  const handleRegister = ((e)=>{
    const {name,value} = e.target
    setUserRegister({...userRegister,[name]:value})
    console.log(userRegister)
  })
  return (
    <>
      <h1>REGISTRO</h1>
      <Outlet context={[userRegister,setUserRegister,handleRegister]}/>
    </>
  )
}
