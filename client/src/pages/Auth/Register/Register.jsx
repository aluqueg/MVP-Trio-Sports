import { useState } from "react";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import "./register.css";

export const Register = () => {
  const [userRegister, setUserRegister] = useState({});
  const [page, setpage] = useState(0);
  const handleRegister = (e) => {
    const { name, value } = e.target;
    setUserRegister({ ...userRegister, [name]: value });
  };
  const continuar = () => {
    setpage(page + 1);
  };
  const volver = () => {
    setpage(page - 1);
  };
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const days = (month) => {
    let day = "";
    if (
      month == "Enero" ||
      month == "Marzo" ||
      month == "Mayo" ||
      month == "Julio" ||
      month == "Agosto" ||
      month == "Octubre" ||
      month == "Diciembre"
    ) {
      day = 31;
    } else if (
      month == "Abril" ||
      month == "Junio" ||
      month == "Septiembre" ||
      month == "Noviembre"
    ) {
      day = 30;
    } else if (month == "Febrero") {
      day = 28;
    }
    return day;
  };

  const [birthDate, setBirthDate] = useState({});
  const handleBirthDate = (e) => {
    const { name, value } = e.target;
    setBirthDate({ ...birthDate, [name]: value });
  };
  const getDays = Array.from(
    { length: days(birthDate?.month) },
    (_, i) => i + 1
  );
  const getYEars = Array.from({ length: 100 }, (_, i) => i + 1 + 1924);
  const continuarBirthDate = () => {
    setpage(page + 1);
    const Date = `${birthDate.day}-${birthDate.month}-${birthDate.year}`;
    setUserRegister({ ...userRegister, date: Date });
  };
  const [noBinario, setNoBinario] = useState(false);
  const selectNobinario = () => setNoBinario(!noBinario);
  const sportsList = ["Fútbol", "Baloncesto", "Tenis", "Natación"];
  const generos = [
    "Hombre trans",
    "Mujer trans",
    "Género Fluido",
    "No binario",
    "Pangénero",
  ];
  const gender = (genero) => {
    setUserRegister({ ...userRegister, gender: genero });
  };

  /* SPORTS */

  const [sports, setSports] = useState([]);
  const addSports = (e) => {
    setSports([...sports, e]);
  };
  const filterSports = (sportName) => {
    return sports.filter((sport) => sport === sportName);
  };
  const removeSports = (sportName) => {
    setSports(sports.filter((sport) => sport !== sportName));
  };
  const addUserSportsContinuar = (array) => {
    setpage(page + 1);
    setUserRegister({ ...userRegister, sports: array });
  };
  console.log(userRegister);
  return (
    <>
      <Form action="">
        {page == 0 ? (
          <>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                onChange={handleRegister}
                value={userRegister?.email}
              />
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>
            {!userRegister.email ? (
              <Button className="button-color">Continuar</Button>
            ) : (
              <Button onClick={continuar}>Continuar</Button>
            )}
          </>
        ) : null}

        {/* NOMBRE Y APELLIDOS */}

        {page == 1 ? (
          <>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>NOMBRE</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                onChange={handleRegister}
                value={userRegister?.name}
              />
              <Form.Text className="text-muted"></Form.Text>
              <Form.Group className="mb-3" controlId="last_name">
                <Form.Label>APELLIDOS</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  name="lastName"
                  onChange={handleRegister}
                  value={userRegister?.lastName}
                />
              </Form.Group>
              <Form.Text className="text-muted"></Form.Text>{" "}
            </Form.Group>
            <Button onClick={volver}>Volver</Button>
            {!userRegister.name ? (
              <Button className="button-color">Continuar</Button>
            ) : (
              <Button onClick={continuar}>Continuar</Button>
            )}
          </>
        ) : null}

        {/* CUMPLEAÑOS */}
        {page === 2 ? (
          <>
            <Form.Group className="mb-3" controlId="day">
              <Form.Label>Dia</Form.Label>
              <Form.Control
                as="select"
                name="day"
                onChange={handleBirthDate}
                value={birthDate?.day}
              >
                {birthDate?.month ? (
                  <option value="">Selecciona un dia</option>
                ) : (
                  <option>Elige mes primero</option>
                )}
                {getDays.map((e, idx) => (
                  <option key={idx} value={e}>
                    {e}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="month">
              <Form.Label>Mes</Form.Label>
              <Form.Control
                as="select"
                name="month"
                onChange={handleBirthDate}
                value={birthDate?.month}
              >
                <option value="">Selecciona un mes</option>
                {months.map((e, idx) => (
                  <option key={idx} value={e}>
                    {e}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="year">
              <Form.Label>Año</Form.Label>
              <Form.Control
                as="select"
                name="year"
                onChange={handleBirthDate}
                value={birthDate?.year}
              >
                <option value="">Selecciona un año</option>
                {getYEars.map((e, idx) => (
                  <option key={idx} value={e}>
                    {e}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button onClick={volver}>Volver</Button>
            {!birthDate?.day || !birthDate?.month || !birthDate?.year ? (
              <Button className="button-color">Continuar</Button>
            ) : (
              <Button onClick={continuarBirthDate}>Continuar</Button>
            )}
          </>
        ) : null}

        {/* CIUDAD */}
        {page == 3 ? (
          <>
            <Form.Group className="mb-3" controlId="city">
              <Form.Label>CUAL ES TU ciudad</Form.Label>
              <Form.Control
                type="text"
                placeholder="cual es tu ciudad"
                name="city"
                onChange={handleRegister}
                value={userRegister?.city}
              />
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>
            <Button onClick={volver}>Volver</Button>
            {!userRegister.city ? (
              <Button className="button-color">Continuar</Button>
            ) : (
              <Button onClick={continuar}>Continuar</Button>
            )}
          </>
        ) : null}

        {/* GENERO */}
        {page == 4 ? (
          <>
            {noBinario ? (
              <div className="generos">
                <ListGroup as="ul" className="all_generos">
                  {generos.map((e, idx) => {
                    return (
                      <ListGroup.Item
                        as="li"
                        key={idx}
                        onClick={() => gender(e)}
                      >
                        {e}
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </div>
            ) : (
              <div className="generos">
                <Button onClick={() => gender("Hombre")}>Hombre</Button>
                <Button onClick={() => gender("Mujer")}>Mujer</Button>
                <Button onClick={selectNobinario}>No Binario</Button>
              </div>
            )}
            <Button onClick={volver}>Volver</Button>
            {!userRegister.gender ? (
              <Button className="button-color">Continuar</Button>
            ) : (
              <Button onClick={continuar}>Continuar</Button>
            )}
          </>
        ) : null}
        {page == 5 ? (
          <>
            <ListGroup as="ul" className="all_generos">
              {sportsList.map((e, idx) => {
                return (
                  <>
                    {filterSports(e) == e ? (
                      <ListGroup.Item
                        as="li"
                        key={idx}
                        onClick={() => removeSports(e)}
                        active
                      >
                        {e}
                      </ListGroup.Item>
                    ) : (
                      <ListGroup.Item
                        as="li"
                        key={idx}
                        onClick={() => addSports(e)}
                      >
                        {e}
                      </ListGroup.Item>
                    )}
                  </>
                );
              })}
            </ListGroup>
            <Button onClick={volver}>Volver</Button>
            {sports.length > 5 || sports.length < 1 ? (
              <Button className="button-color">Continuar</Button>
            ) : (
              <Button onClick={() => addUserSportsContinuar(sports)}>
                Continuar
              </Button>
            )}
          </>
        ) : null}
      </Form>
    </>
  );
};
