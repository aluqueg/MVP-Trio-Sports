import { Button, Col, Container, Row } from "react-bootstrap";
import { Outlet, useNavigate } from "react-router-dom";
import { TrioContext } from "../../context/TrioContextProvider";
import { useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import "./profile.css";
import ModalEditUser from "../../components/ModalEditUser/ModalEditUser";
import axios from "axios";

export const Profile = () => {
  const navigate = useNavigate();
  const { user, token } = useContext(TrioContext);
  const userBirthDate = parseInt(user?.birth_date);
  const today = parseInt(format(new Date(), "yyyy-MM-dd"));
  const age = today - userBirthDate;
  const [showModal, setShowModal] = useState(false)
  const [practiceSports, setPracticeSports] = useState([])

  const handleOpen = () => {
    setShowModal(true)
  }

  useEffect(()=>{
    axios
        .get(`http://localhost:4000/api/users/getPracticeSports`,{headers:{Authorization: `Bearer ${token}`}})
        .then(res=>{
          setPracticeSports(res.data)
        })
        .catch(err=>{console.log(err)})
  },[])

  return (
    <Container fluid="xxl">
      <Row className="my-3">
        <Col md lg="3">
          <img
            className="profile-pic"
            src={
              user?.user_img
                ? `http://localhost:4000/images/users/${user?.user_img}`
                : `../../src/assets/images/default_user_img.png`
            }
            alt="profile picture"
          />
        </Col>
        <Col md lg="3">
          <h3>
            {user?.user_name} {user?.last_name}
          </h3>
          <h4>
            {age} años, {user?.gender}
          </h4>
          <h4>{user?.user_city}</h4>
          {!Array.isArray(practiceSports) ? <p>No hay deportes seleccionados</p> : practiceSports?.map((e, idx)=><h4 key={idx}>{e.sport_name}</h4>)}
        </Col>
        <Col md lg="6">
          <h4>{user?.description}</h4>
          <Button onClick={handleOpen}>Editar perfil</Button>
        </Col>
      </Row>
      <Row className="my-3">
        <Col xxl="12" className="d-flex gap-3 mb-3">
          <Button onClick={() => navigate("/profile")}>Mis Actividades</Button>
          <Button onClick={() => navigate("/profile/1")}>Participado</Button>
        </Col>
        <Col>
          <Outlet />
        </Col>
      </Row>
      <ModalEditUser show={showModal} setShowModal={setShowModal} data={user} token={token}/>
    </Container>
  );
};
