import axios from 'axios';
import React, { useState } from 'react'
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export const EditPassword = () => {
  const initialValue = {
    text: "",
    show: false
  }

  const [password, setPassword] = useState("")
  const [msg, setMsg] = useState(initialValue)

  const onSubmit = async () => {
    if(!password){
      setMsg({text: "El campo no puede estar vacío.", show: true})
    }else{
      setMsg({show: false})
    }
    try {
      const res = await axios.put("http://localhost:4000/api/users/editPassword", password)
    }catch(err){
      console.log(err);      
    }
  }

  const handleChange = (e) => {
    const password = e.target.value;
    setPassword(password)
  }

  return (
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Cambia la contraseña.</Form.Label>
        <Form.Control
          type="password"
          placeholder="Nueva contraseña"
          name="password"
          value={password}
          onChange={handleChange}
        />
        {msg.show && <p>{msg.text}</p>}
        <Form.Text>
          Introduce una nueva contraseña.
        </Form.Text>
      </Form.Group>
      <Button variant="primary" onClick={onSubmit}>
        Cambiar
      </Button>
    </Form>
  )
}
