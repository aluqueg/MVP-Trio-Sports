import { Button, Container, Nav, Navbar, Offcanvas } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"

export const NavBarApp = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar expand='md' className="bg-body-tertiary mb-3">
        <Container fluid>
          <Navbar.Brand as={Link} to="/allActivities">Logo</Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-md`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-md`}
            aria-labelledby={`offcanvasNavbarLabel-expand-md`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-md`}>
                Offcanvas
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-start flex-grow-1 pe-3">
                <Nav.Link as={Link} to="/allActivities">Actividades</Nav.Link>
                <Nav.Link as={Link} to="/addActivity">Crear Actividad</Nav.Link>
                <Nav.Link as={Link} to="/allUsers">Busqueda</Nav.Link>
                <Nav.Link as={Link} to="/chats">Mensajes</Nav.Link>
                <Nav.Link as={Link} to="/profile">Perfil</Nav.Link>
              </Nav>
              <Nav className="d-flex">
                <Button 
                  variant="outline-success"
                  onClick={()=>navigate('/login')}
                >Iniciar Sesión</Button>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
  </>
  )
}
