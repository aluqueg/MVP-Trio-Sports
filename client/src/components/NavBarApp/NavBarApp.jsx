import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import "./navBarApp.css";
import { useContext } from "react";
import { TrioContext } from "../../context/TrioContextProvider";

export const NavBarApp = () => {
  const { user, setUser, setToken } = useContext(TrioContext);
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("token");
    setToken();
    setUser();
    navigate("/");
  };
  console.log("user", user)
  return (
    <>
      <Navbar expand="md" className="bg-body-tertiary mb-3">
        <Container fluid="xl">
          <Navbar.Brand as={Link} to="/allActivities">
            <img className="nav-logo" src={logo} alt="logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-md`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-md`}
            aria-labelledby={`offcanvasNavbarLabel-expand-md`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-md`}>
                Menú
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav
                variant="underline"
                defaultActiveKey="/allActivities"
                className="justify-content-start flex-grow-1 pe-3"
              >
                <Nav.Link as={Link} to="/allActivities">
                  Actividades
                </Nav.Link>
                <Nav.Link as={Link} to="/addActivity">
                  Crear Actividad
                </Nav.Link>
                <Nav.Link as={Link} to="/addSport">
                  Crear Deporte
                </Nav.Link>
                <Nav.Link as={Link} to="/allUsers">
                  Búsqueda
                </Nav.Link>
                <Nav.Link as={Link} to="/chats">
                  Mensajes
                </Nav.Link>
                <Nav.Link as={Link} to="/profile">
                  Perfil
                </Nav.Link>
              </Nav>
              <Nav className="d-flex">
                {!user ? (
                  <button
                    onClick={() => navigate("/login")}
                    className="login-btn"
                  >
                    Iniciar Sesión
                  </button>
                ) : (
                  <button className="login-btn" onClick={logOut}>
                    Cerrar Sesión
                  </button>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};
