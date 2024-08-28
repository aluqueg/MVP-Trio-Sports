import { useNavigate } from "react-router-dom";
import "../Home/home.css";
import "../../components/NavBarApp/navBarApp.css";
import { Col, Row } from "react-bootstrap";
import { HOME_CARD_DATA } from "../../helpers/CardHomeData";
import { CardHome } from "../../components/CardHome/CardHome";

export const Home = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/register");
  };
  console.log("card info", HOME_CARD_DATA)
  return (
    <>
      <Row className="home-register-section">
        <Col className="d-flex flex-column justify-content-center align-items-center gap-5">
          <h1 className="home-title">Conectando a través del deporte</h1>
          <button className="home-btn" onClick={handleRegisterClick}>
            Registrarse
          </button>
        </Col>
      </Row>
      <Row className="home-info-section d-flex flex-column justify-content-center align-items-center">
        <Col className="d-flex flex-column justify-content-center align-items-center gap-5">
        <h1>Haz deporte, vive la aventura en TRIO</h1>
        <div className="division-section">
          <h2>Juega, disfruta, conéctate</h2>
        </div>
        <h2>¿Por qué TRIO?</h2>
        </Col>
        <Col className="d-flex flex-wrap justify-content-center gap-3">
            {HOME_CARD_DATA.map((e, idx)=>{
              return <CardHome className="home-card" key={idx} data={e} />
            })}
        </Col>
      </Row>
    </>
  );
};
