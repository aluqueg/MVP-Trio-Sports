import Button from "react-bootstrap/esm/Button";
import { TrioContext } from "../../context/TrioContextProvider";
import { useContext, useEffect, useState } from "react";
import { CardOneUser } from "../../components/CardOneUser/CardOneUser";
import axios from "axios";
import { gender } from "../../helpers/genderData";
import { Col, Container, Row, Form } from "react-bootstrap";
import "./allUsers.css";

export const AllUsers = () => {
  const { user, token, setToken, sports, setSports } = useContext(TrioContext);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteresUsers] = useState(allUsers);
  const [selectedSport, setSelectedSport] = useState("");
  const [age, setAge] = useState(null);
  const [selectedGender, setSelectedGender] = useState("");
  const [location, setLocation] = useState("");
  const [userMostrados, setUserMostrados] = useState(false);

  useEffect(() => {
    const peticionUserSports = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/users/getAllUsers",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAllUsers(res.data);
        console.log("todos los datos de res", res);
      } catch (err) {
        console.log(err);
      }
    };
    peticionUserSports();
  }, []);

  const handleChange = (e) => {
    if (isNaN(age)) {
      setAge("");
    } else {
      setAge(parseInt(e.target.value));
    }
  };

  const handleClick = () => {
    const filtered = allUsers.filter((user) => {
      return (
        (selectedSport ? user.sports.includes(selectedSport) : true) &&
        (age ? user.age === age : true) &&
        (selectedGender ? user.gender === selectedGender : true) &&
        (location
          ? user.user_city.toLowerCase().includes(location.toLowerCase())
          : true)
      );
    });
    setUserMostrados(true);
    setFilteresUsers(filtered);
    console.log("handleClick");
    console.log(selectedSport);
    console.log(age);
    console.log(selectedGender);
    console.log(location);
  };

  return (
    <Container>
      <Row>
        <Col
          xs={12}
          sm={6}
          md={4}
          lg={2}
          className="d-flex justify-content-center gap-5"
        >
          <Form.Group className="filter-group">
          <Form.Select
            id="deporte"
            title="Deporte"
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            className="filter-select"
            >
              <option value="">Todos los deportes</option>
            {sports.map((e) => {
              return (
                <option key={e.sport_id} value={e.sport_name}>
                  {e.sport_name}
                </option>
              );
            })}
          </Form.Select>
            </Form.Group>
        </Col>
        <Col xs={12} sm={6} md={4} lg={2}>
          <input
            className="filter-input"
            type="text"
            placeholder="Edad"
            value={age ? age : ""}
            onChange={handleChange}
          />
        </Col>
        <Col xs={12} sm={6} md={4} lg={2}>
        <Form.Group className="filter-group">
          <Form.Select
            id="sexo"
            title="Sexo"
            value={selectedGender}
            className="filter-select"
            onChange={(e) => setSelectedGender(e.target.value)}
            >
            <option value="">Sexo</option>
            {gender.map((e, index) => {
              return (
                <option key={index} >
                  {e}
                </option>
              );
            })}
          </Form.Select>
            </Form.Group>
        </Col>
        <Col xs={12} sm={6} md={4} lg={2}>
          <input
            className="filter-input"
            type="text"
            placeholder="Ubicación"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Col>
        <Col xs={12} sm={6} md={4} lg={2}>
          <Button className="filter-button" onClick={handleClick}>
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
