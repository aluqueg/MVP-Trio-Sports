import { useState } from "react";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import "./register.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getMonth, getYear, format } from "date-fns";
import { setDefaultLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
setDefaultLocale("es");
import axios from 'axios'

export const Register = () => {
  const [userRegister, setUserRegister] = useState({});
  const [page, setpage] = useState(0);
  const [msgEmail,setMsgEmail] = useState()
  const handleRegister = (e) => {
    const { name, value } = e.target;
    setUserRegister({ ...userRegister, [name]: value });
  };
  const continuar = () => {
    setpage(page + 1);
  };
  console.log
  const continuarEmail =  async ()=>{
    try{
      const res = await axios.post("http://localhost:4000/api/users/emailValidator",userRegister)
      
      if(res.data[0]){
        setMsgEmail("Este email ya esta en uso")
      }else{
        setpage(page + 1)
      }
      

      
    }catch(err){
      console.log(err)
    }
  }

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
  const range = (start, end, step = 1) => {
    let output = [];
    for (let i = start; i < end; i += step) {
      output.push(i);
    }
    return output;
  };
  const [defaultDate,setDefaultDate] = useState(new Date())
  const [startDate, setStartDate] = useState(new Date());
  const years = range(1990, getYear(new Date()) + 1, 1);
  const continuarBirthDate = () => {
    setpage(page + 1);
    const Date = format(startDate, `dd-MM-yyyy`);
    setUserRegister({ ...userRegister, date: Date });
  };

  /* GENERO */

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
              {msgEmail? <p>{msgEmail}</p> : null}
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
              <Button onClick={continuarEmail}>Continuar</Button>
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
            <DatePicker
              locale={es}
              renderCustomHeader={({
                date,
                changeYear,
                changeMonth,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
              }) => (
                <div
                  style={{
                    margin: 10,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                  >
                    {"<"}
                  </button>
                  <select
                    value={getYear(date)}
                    onChange={({ target: { value } }) => changeYear(value)}
                  >
                    {years.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  <select
                    value={months[getMonth(date)]}
                    onChange={({ target: { value } }) =>
                      changeMonth(months.indexOf(value))
                    }
                  >
                    {months.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                  >
                    {">"}
                  </button>
                </div>
              )}
              selected={startDate}
              onChange={(date) => setStartDate(date)}
            />
            <Button onClick={volver}>Volver</Button>
            {format(startDate, `dd-MM-yyyy`) === format(defaultDate, `dd-MM-yyyy`) ? (
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
