import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { TrioContext } from "../../../context/TrioContextProvider";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container } from "react-bootstrap";
import './login.css'

//valor inicial login
const initialValue = {
  email: "",
  password: "",
};

//valor inicial mensaje
const initialValueMsg = {
  text: "",
  show: false,
};

export const Login = () => {
  const { user, setUser , setToken} = useContext(TrioContext);
  const [login, setLogin] = useState(initialValue);
  const [msg, setMsg] = useState(initialValueMsg);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };
  const onSubmit = async () => {
    if (!login.email || !login.password) {
      setMsg({ text: "Debes cumplimentar todos los campos", show: true });
      return
    }

    try {
      const res = await axios.post(
        "http://localhost:4000/api/users/login",
        login
      );
      let token = res.data;

      localStorage.setItem("token", token);

      const response = await axios.get("http://localhost:4000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(response.data);
      setToken(token)
      console.log(response.data)

      if (response.data.type === 2) {
        navigate("/allActivities");
      } else if (response.data.type === 1) {
        navigate("/admin");
      }
    } catch (err) {
      console.log(err);

      if (err.response.status === 401) {
        setMsg({
          show: true,
          text: err.response.data,
        });
      }
    }
  };
  return (
      <Container fluid="xl">
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="email"
              placeholder="Correo electrónico"
              name="email"
              value={login.email}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={login.password}
              onChange={handleChange}
            />
          </Form.Group>
          {msg.show && <p>{msg.text}</p>}
          <Button variant="primary" onClick={onSubmit}>
            Inicia sesión
          </Button>
        </Form>
        <p><Link to='/recoverPassword'>¿Has olvidado la contraseña?</Link></p>
        <hr />
        <Button
          onClick={()=>navigate("/register")}
        >Crea cuenta nueva</Button>
      </Container>
  );
};
