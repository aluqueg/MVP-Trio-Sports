import React, { useEffect } from 'react'
import axios from 'axios'
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./validation.css"

export const Validation = () => {
  const url = `${location.pathname}`
  const partes = url.split('/')
  const validationToken = partes[2]
  const navigate = useNavigate();
  useEffect(()=>{
    if(validationToken){
      axios.put(`http://localhost:4000/api/users/validation/${validationToken}`)
      .then(res=>{
        console.log(res)
      })
      .catch(error=>{
        console.log(error)
      })
    }
  },[])
  return (
    <div className='body-validation'>
      <h1 className='mb-5'>Correo Validado</h1>
      <button className='trio-btn' onClick={()=>navigate("/login")}>Ir a Login</button>
    </div>
  )
}
