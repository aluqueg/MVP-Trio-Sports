import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Button from "react-bootstrap/esm/Button";
import { TrioContext } from "../../context/TrioContextProvider";
import { useContext, useEffect, useState } from "react";
import { CardOneUser } from "../../components/CardOneUser/CardOneUser";
import axios from "axios";
import { gender } from "../../helpers/genderData";
import { differenceInYears, format } from "date-fns";
import { Col, Container, Row } from "react-bootstrap";
import './allUsers.css'

export const AllUsers = () => {
  const { user, token, setToken, sports, setSports } = useContext(TrioContext);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteresUsers] = useState(allUsers);
  const [selectedSport, setSelectedSport] = useState("");
  const [age, setAge] = useState(null);
  const [selectedGender, setSelectedGender] = useState("");
  const [location, setLocation] = useState("");
  const [userMostrados, setUserMostrados] = useState(false)

  useEffect(() => {
    const peticionUserSports = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/users/getAllUsers",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAllUsers(res.data);
        console.log("todos los datos de res",res);
      } catch (err) {
        console.log(err);
      }
      
    };
    peticionUserSports();
  }, []);

  const handleChange = (e) =>{
    if(isNaN(age)){
      setAge("")
    }else{
      setAge(parseInt(e.target.value))      
    }
  }
  

  const handleClick = () => {    
    const filtered = allUsers.filter((user) => {
      return (
        (selectedSport
          ? user.sports === selectedSport
          : true) &&
        (age ? user.age === age : true) &&
        (selectedGender ? user.gender === selectedGender : true) &&
        (location ? user.user_city.toLowerCase().includes(location.toLowerCase()) : true)
      );
    });
    setUserMostrados(true)
    setFilteresUsers(filtered);
    console.log("handleClick");
    console.log(selectedSport);
    console.log(age);
    console.log(selectedGender);
    console.log(location);    
  };

  return (
    <Container >
      <Row >        
          <Col xs={12} sm={6} md={4} lg={2} className="d-flex justify-content-center gap-5">
            <DropdownButton
              id="deporte"
              title="Deporte"
              value={selectedSport}
              onSelect={(e) => setSelectedSport(e)}
              className="rounded-pill"
            >
              {sports.map((e) => {
                return (
                  <Dropdown.Item key={e.sport_id} eventKey={e.sport_name}>
                    {e.sport_name}
                  </Dropdown.Item>
                );
              })}
            </DropdownButton>
            </Col>
            <Col xs={12} sm={6} md={4} lg={2}>
            <input
              className="rounded-5"
              type="text"
              placeholder="Edad"
              value={age ? age : ""}
              onChange={handleChange}
            />
            </Col>
            <Col xs={12} sm={6} md={4} lg={2}>
            <DropdownButton
              id="sexo"
              title="Sexo"
              value={selectedGender}
              onSelect={(e) => setSelectedGender(e)}
            >
              {gender.map((e, index) => {
                return (
                  <Dropdown.Item key={index} eventKey={e}>
                    {e}
                  </Dropdown.Item>
                );
              })}
            </DropdownButton>
            </Col>
            <Col xs={12} sm={6} md={4} lg={2}>
            <input
              className="rounded-5"
              type="text"
              placeholder="Ubicación"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            </Col>
            <Col xs={12} sm={6} md={4} lg={2}>
            <Button className="rounded-5" onClick={handleClick}>
              Buscar
            </Button>
          </Col>        
      </Row>
      <hr />

      <Row>
        <Col>
          <div className="d-flex flex-wrap gap-3">
            {userMostrados
              ? filteredUsers.map((e, index) => {
                  return <CardOneUser key={index} data={e} />;
                })
              : allUsers.map((e, index) => {
                return <CardOneUser key={index} data={e} />;
              })}
          </div>
        </Col>
      </Row>
    </Container>
  );
};
