import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";

export const RecoverPassword = () => {
  const initialValue = {
    text: "",
    show: false,
  };

  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState(initialValue);

  const onSubmit = async () => {
    if (!email) {
      setMsg({ text: "El campo no puede estar vacío", show: true });      
    }else{
      setMsg({show:false})
    }
    try {
      const res = await axios.post(
        "http://localhost:4000/api/users/recoverPassword",
        email
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  return (
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>¿Problemas con la contraseña?</Form.Label>
        <Form.Control
          type="email"
          placeholder="Introduce tu email"
          name="email"
          value={email}
          onChange={handleChange}
        />
        {msg.show && <p>{msg.text}</p>}
        <Form.Text>
          Introduce la dirección de correo electrónico que utilizas en tu
          cuenta. Te enviarémos instrucciones para reestablecer la contraseña.
        </Form.Text>
      </Form.Group>
      <Button variant="primary" onClick={onSubmit}>
        Enviar
      </Button>
    </Form>
  );
};
