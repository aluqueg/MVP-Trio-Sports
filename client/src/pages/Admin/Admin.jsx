import { useEffect, useContext, useState } from 'react'
import axios from 'axios'
import { TrioContext } from "../../context/TrioContextProvider";
import { Outlet, useNavigate } from 'react-router-dom';
import { Button, Col, Container, Row } from "react-bootstrap";

export const Admin = () => {
  const { user, token } = useContext(TrioContext);
  const navigate = useNavigate();
  return (
    <Container fluid = "xxl">
            <Row className="my-3">
        <Col xxl="12" className="d-flex gap-3 mb-3">
          <Button onClick={() => navigate("/admin")}>Todos los Usuarios</Button>
          <Button onClick={() => navigate("/admin/1")}>Todos los Deportes</Button>
        </Col>
        <Col>
          <Outlet />
        </Col>
      </Row>
    </Container>
  )
}
