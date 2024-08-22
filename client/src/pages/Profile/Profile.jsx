import { Button, Col, Container, Row } from "react-bootstrap";
import { Outlet, useNavigate } from "react-router-dom";
import { TrioContext } from "../../context/TrioContextProvider";
import { useContext } from "react";
import { format } from "date-fns";
import "./profile.css";

export const Profile = () => {
  const navigate = useNavigate();
  const { user } = useContext(TrioContext);
  let userBirthDate = parseInt(user?.birth_date);
  let today = parseInt(format(new Date(), "yyyy-MM-dd"));
  let age = today - userBirthDate;

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
        </Col>
        <Col md lg="6">
          <h4>{user?.description}</h4>
          <Button>Editar perfil</Button>
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
    </Container>
  );
};
