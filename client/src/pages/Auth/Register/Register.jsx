import { useState } from "react";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";
import "./register.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getMonth, getYear, format } from "date-fns";
import { setDefaultLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
import { useNavigate } from "react-router-dom";
setDefaultLocale("es");

export const Register = () => {
  const [userRegister, setUserRegister] = useState({});
  const [page, setpage] = useState(0);
  const navigate = useNavigate();
     //manejo de errores nuevo
     const [formErrors, setFormErrors] = useState({});

  const [msgEmail, setMsgEmail] = useState();
  const handleRegister = (e) => {
    const { name, value } = e.target;
    setUserRegister({ ...userRegister, [name]: value });
  };


  // const continuar = () => {
  //   setpage(page + 1);
  // };

     //validación de campos
     const validateField = (name, value) => {
      let error = '';

      switch (name) {
          case 'name':
              if (!value) {
                  error = 'El nombre es obligatorio';
              }
              break;
          case 'email':
              if (!value) {
                  error = 'El email es obligatorio';
              } else if (!/\S+@\S+\.\S+/.test(value)) {
                  error = 'El email no es válido';
              }
              break;
          // otras validaciones...
          default:
              break;
      }

      setFormErrors({ ...formErrors, [name]: error });

      // Retorna true si no hay errores
      return error === '';
  };


const continuarEmail = async () => {
  try {
    const res = await axios.post(
      "http://localhost:4000/api/users/emailValidator",
      userRegister
    );
    console.log("continuar res", res);
    
    if (res.data[0]) {
      setFormErrors({...formErrors, ["email"]:"Este email ya esta en uso" });
    }else if (!/\S+@\S+\.\S+/.test(userRegister.email)){
      setFormErrors({ ...formErrors, ["email"]: "Formato de email incorrecto" });
    }else{
      setpage(page +1)
    }
  } catch (err) {
    console.log(err);
  }
};

const continuar = () => {
  // Validar los campos de la página actual
  const isValid = Object.keys(userRegister).every((key) => validateField(key, userRegister[key]));
  console.log("valid",isValid);
  
  if (isValid) {
      // Avanza a la siguiente página si la validación es exitosa
      setpage(page + 1);
      setFormErrors({})
  }
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
  const range = (start, end, step = 1) => {
    let output = [];
    for (let i = start; i < end; i += step) {
      output.push(i);
    }
    return output;
  };
  const [defaultDate, setDefaultDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const years = range(1990, getYear(new Date()) + 1, 1);
  const lastLogDate = format(startDate, `yyyy-MM-dd HH-mm-ss`);
  const lastLogDate = format(startDate, `yyyy-MM-dd HH:mm:ss `);
  const continuarBirthDate = () => {
    setpage(page + 1);
    /*     const Date = format(startDate, `dd-MM-yyyy`); */
    setUserRegister({ ...userRegister, birth_date: lastLogDate });
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

  /* ENVIAR DATOS REGISTER */
  const [file, setFile] = useState({});
  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = () => {
    const newFormData = new FormData();
    newFormData.append("userRegister", JSON.stringify(userRegister));
    newFormData.append("last_log_date", lastLogDate);
    if (file) {
      newFormData.append("file", file);
    }

    axios
      .post("http://localhost:4000/api/users/createUser", newFormData)
      .then((res) => {
        console.log(res);
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <Form action="">
        {page == 0 ? (
          <>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              {formErrors.email && <span>{formErrors.email}</span>}
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                onChange={handleRegister}
                value={userRegister?.email}
                />
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Contraseña</Form.Label>
                {formErrors.password && <span>{formErrors.password}</span>}
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                onChange={handleRegister}
                value={userRegister?.password}
              />
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>
            {!userRegister.email || !userRegister.password ? (
              <Button className="button-color">Continuar</Button>
            ) : (
              <Button onClick={continuarEmail}>Continuar</Button>
            )}
          </>
        ) : null}

        {/* NOMBRE Y APELLIDOS */}

        {page == 1 ? (
          <>
            <Form.Group className="mb-3" controlId="user_name">
              <Form.Label>NOMBRE</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="user_name"
                onChange={handleRegister}
                value={userRegister?.user_name}
              />
              <Form.Text className="text-muted"></Form.Text>
              <Form.Group className="mb-3" controlId="last_name">
                <Form.Label>APELLIDOS</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  name="last_name"
                  onChange={handleRegister}
                  value={userRegister?.lastName}
                />
              </Form.Group>
              <Form.Text className="text-muted"></Form.Text>{" "}
            </Form.Group>
            <Button onClick={volver}>Volver</Button>
            {!userRegister.user_name || !userRegister.last_name ? (
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
            {format(startDate, `dd-MM-yyyy`) ===
            format(defaultDate, `dd-MM-yyyy`) ? (
              <Button className="button-color">Continuar</Button>
            ) : (
              <Button onClick={continuarBirthDate}>Continuar</Button>
            )}
          </>
        ) : null}

        {/* CIUDAD */}
        {page == 3 ? (
          <>
            <Form.Group className="mb-3" controlId="user_city">
              <Form.Label>CUAL ES TU CIUDAD</Form.Label>
              <Form.Control
                type="text"
                placeholder="cual es tu ciudad"
                name="user_city"
                onChange={handleRegister}
                value={userRegister?.user_city}
              />
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>
            <Button onClick={volver}>Volver</Button>
            {!userRegister.user_city ? (
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
        {/* FOTO */}
      </Form>
      {page == 6 ? (
        <>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="file">Sube una foto</Form.Label>
            <Form.Control
              id="file"
              type="file"
              name="user_img"
              placeholder="Enter city"
              hidden
              onChange={handleFile}
            />
          </Form.Group>
          <Button onClick={volver}>Volver</Button>
          <Button onClick={onSubmit}>Enviar</Button>
        </>
      ) : null}
    </>
  );
};
