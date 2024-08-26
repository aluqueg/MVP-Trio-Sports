import { Button, Col, Container, Row } from "react-bootstrap";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { TrioContext } from "../../context/TrioContextProvider";
import { useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import "./oneUser.css";
import axios from "axios";

export const OneUser = () => {

  const navigate = useNavigate();
  const { user, token } = useContext(TrioContext);
  const {id} = useParams()
  const [oneUser, setOneUser] = useState({})
  const userBirthDate = parseInt(user?.birth_date);
  const today = parseInt(format(new Date(), "yyyy-MM-dd"));
  const [showModal, setShowModal] = useState(false)
  const [practiceSports, setPracticeSports] = useState([])

  // useEffect(()=>{
  //   axios
  //       .get(`http://localhost:4000/api/users/getPracticeSports`,{headers:{Authorization: `Bearer ${token}`}})
  //       .then(res=>{
  //         setPracticeSports(res.data)
  //         console.log("los deportes", practiceSports);
          
  //       })
  //       .catch(err=>{console.log(err)})
  // },[])

  useEffect(()=>{
    const oneUser = async () => {
      try{
        const res = await axios.get(`http://localhost:4000/api/users/getOneUser/${id}`, {headers: {Authorization: `Bearer ${token}`}});
        setOneUser(res.data[0])        
      }catch(err){
        console.log(err);        
      }
    }
    if(token){
      oneUser()
    }
  },[token])
  
console.log("el oneuser", oneUser);

  return (
    <Container fluid="xxl">
      <Row className="my-3">
        <Col md lg="3">
          <img
            className="profile-pic"
            src={
              oneUser?.user_img
                ? `http://localhost:4000/images/users/${oneUser?.user_img}`
                : `../../src/assets/images/default_user_img.png`
            }
            alt="profile picture"
          />
        </Col>
        <Col md lg="3">
          <h3>
            {oneUser?.user_name} {oneUser?.last_name}
          </h3>
          <h4>
            {oneUser.age} años, {oneUser?.gender}
          </h4>
          <h4>{oneUser?.user_city}</h4>
          {oneUser.sports ? oneUser.sports : <p>No hay deportes seleccionados</p>}
        </Col>
        <Col md lg="6">
          <h4>{oneUser?.description}</h4>
        </Col>
      </Row>
      <Row className="my-3">
        <Col xxl="12" className="d-flex gap-3 mb-3">
          <Button onClick={() => navigate(`/oneUser/${id}`)}>Actividades creadas</Button>
          <Button onClick={() => navigate(`/oneUser/${id}/1`)}>Participado</Button>
        </Col>
        <Col>
          <Outlet />
        </Col>
      </Row>
    </Container>
  )
}
