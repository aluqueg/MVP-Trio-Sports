import React from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { format } from "date-fns";
import { Col, Row } from "react-bootstrap";

export const CardOneUser = ({ data }) => {
  let userBirthDate = parseInt(data.birth_date);
  let today = parseInt(format(new Date(), "yyyy-MM-dd"));
  let age = today - userBirthDate;  
  

  return (    
      <Card className="rounded-4" style={{ width: "830px" }}>        
      <Row>
        <Col md={4} >
          <Card.Img className="h-100"   src={`http://localhost:4000/images/users/${data.user_img}`} fluid />
        </Col>
        <Col md={8}>
          <Card.Body>
            <Card.Title>
              <h2>{data?.user_name} {data?.last_name}</h2>
            </Card.Title>
            <Card.Text>
              <h4>{age} años - {data?.gender}</h4>
            </Card.Text>
            <Card.Text><h5>{data?.user_city}</h5></Card.Text>
            <Card.Text><h5>{data?.sports}</h5></Card.Text>
            <Card.Text><h5>{data.practice}</h5></Card.Text>
            <Card.Text><h5>{data?.description}</h5></Card.Text>
          </Card.Body>        
        </Col>
      </Row>
      </Card>    
  );
};
