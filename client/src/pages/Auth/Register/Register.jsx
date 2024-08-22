import { useContext, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { Button, Container } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";
import "./register.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getMonth, getYear, format, subYears } from "date-fns";
import { setDefaultLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
import { useNavigate } from "react-router-dom";
import { ModalCreateSport } from "../../../components/ModalCreateSport/ModalCreateSport";
import { TrioContext } from "../../../context/TrioContextProvider";
setDefaultLocale("es");

export const Register = () => {
  const [userRegister, setUserRegister] = useState({});
  const [page, setpage] = useState(0);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [sportId, setSportId] = useState("");
  //manejo de errores nuevo
  const [formErrors, setFormErrors] = useState({});
  const [validateEmail, setValidateEmail] = useState(false);
  const [validatePassword, setValidatePassword] = useState(false);
  const { sports, setSports } = useContext(TrioContext);

  const handleRegister = (e) => {
    const { name, value } = e.target;
    setUserRegister({ ...userRegister, [name]: value });
  };

  //validación de campos
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "user_name":
        if (!value) {
          error = "El nombre es obligatorio";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,15}$/.test(value)) {
          error =
            "El nombre ingresado no es válido. Por favor, asegúrate de que solo contenga letras, espacios, y no supere los 15 caracteres.";
        } else {
          error = "";
        }
        break;
      case "last_name":
        if (!value) {
          error = "El apellido es obligatorio";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,15}$/.test(value)) {
          error =
            "El apellido ingresado no es válido. Por favor, asegúrate de que solo contenga letras, espacios, y no supere los 15 caracteres.";
        } else {
          error = "";
        }
        break;
      case "user_city":
        if (!value) {
          error = "La ciudad es un campo obligatorio";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,200}$/.test(value)) {
          error =
            "La ciudad ingresada no es válido. Por favor, asegúrate de que solo contenga letras, espacios, y no supere los 200 caracteres.";
        } else {
          error = "";
        }
        break;

      default:
        break;
    }

    setFormErrors({ ...formErrors, [name]: error });

    // Retorna true si no hay errores
    return error === "";
  };

  const continuarEmail = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/users/emailValidator",
        userRegister
      );
      console.log("continuar res", res);

      let emailIsValid = false;
      let passwordIsValid = false;
      let emailError = "";
      let passwordError = "";

      if (
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
          userRegister.email
        )
      ) {
        emailError = "Formato de email incorrecto";
        console.log("error 1");
      } else if (res.data[0]) {
        emailError = "Este email ya esta en uso";
        console.log("error 2");
      } else {
        emailIsValid = true;
      }

      if (!userRegister.password) {
        passwordError = "La contraseña es obligatoria";
      } else if (
        !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/.test(
          userRegister.password
        )
      ) {
        passwordError = "Contaseña no segura";
      } else {
        passwordIsValid = true;
      }

      setFormErrors({
        ...formErrors,
        ["email"]: emailError,
        ["password"]: passwordError,
      });

      setValidateEmail(emailIsValid);
      setValidatePassword(passwordIsValid);

      if (emailIsValid && passwordIsValid) {
        setpage(page + 1);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const continuar = () => {
    // Validar los campos de la página actual
    const isValid = Object.keys(userRegister).every((key) =>
      validateField(key, userRegister[key])
    );
    console.log("valid", isValid);

    if (isValid) {
      // Avanza a la siguiente página si la validación es exitosa
      setpage(page + 1);
      setFormErrors({});
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
  const [startDate, setStartDate] = useState(subYears(new Date(), 18));
  const maxDate = subYears(new Date(), 18);
  const years = range(1990, getYear(new Date()) + 1, 1);
  const lastLogDate = format(startDate, `yyyy-MM-dd HH-mm-ss`);
  const continuarBirthDate = () => {
    setpage(page + 1);
    const Date = format(startDate, `yyyy-MM-dd`);
    setUserRegister({ ...userRegister, birth_date: Date });
  };

  /* GENERO */

  const [noBinario, setNoBinario] = useState(false);
  const selectNobinario = () => setNoBinario(!noBinario);
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

  const [modalAddSports, setModalAddSports] = useState(false);
  const addSportStatus = () => setModalAddSports(!modalAddSports);
  const [selectedSport, setSelectedSport] = useState([]);

  const addSports = (e) => {
    setSelectedSport([...selectedSport, e]);
  };

  const removeSports = (e) => {
    setSelectedSport(selectedSport.filter((sport) => sport !== e));
  };
  const addUserSportsContinuar = (array) => {
    setpage(page + 1);
    setUserRegister({ ...userRegister, sports: array });
  };

  const handleSportCreated = (newSport) => {
    setSports((prevSports) => [...prevSports, newSport]);
    setSportId(newSport.sport_id); //Selecciona automáticamente el nuevo deporte
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
    newFormData.append("sports", selectedSport);
    console.log(selectedSport, "*************");
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
    <Container>
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
              {formErrors.email ? (
                <span className="error-msg">{formErrors.email}</span>
              ) : null}
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                onChange={handleRegister}
                value={userRegister?.password}
              />
              {formErrors.password ? (
                <span className="error-msg">{formErrors.password}</span>
              ) : null}
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>
            {!userRegister.email || !userRegister.password ? (
              <Button className="button-color">Continuar</Button>
            ) : (
              <Button onClick={continuarEmail}>Continuar</Button>
            )}
          </>
        ) : null}

        {/* NOMBRE */}

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
              {formErrors.user_name ? (
                <span className="error-msg">{formErrors.user_name}</span>
              ) : null}
              <Form.Text className="text-muted"></Form.Text>{" "}
            </Form.Group>
            <Button onClick={volver}>Volver</Button>
            {!userRegister.user_name ? (
              <Button className="button-color">Continuar</Button>
            ) : (
              <Button onClick={continuar}>Continuar</Button>
            )}
          </>
        ) : null}

        {/* APELLIDOS */}
        {page == 2 ? (
          <>
            <Form.Group className="mb-3" controlId="user_name">
              <Form.Text className="text-muted"></Form.Text>
              <Form.Group className="mb-3" controlId="last_name">
                <Form.Label>APELLIDOS</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  name="last_name"
                  onChange={handleRegister}
                  value={userRegister?.last_name}
                />
                {formErrors.last_name ? (
                  <span className="error-msg">{formErrors.last_name}</span>
                ) : null}
              </Form.Group>
              <Form.Text className="text-muted"></Form.Text>{" "}
            </Form.Group>
            <Button onClick={volver}>Volver</Button>
            {!userRegister.last_name ? (
              <Button className="button-color">Continuar</Button>
            ) : (
              <Button onClick={continuar}>Continuar</Button>
            )}
          </>
        ) : null}

        {/* CUMPLEAÑOS */}
        {page === 3 ? (
          <>
            <DatePicker
              showIcon
              locale={es}
              maxDate={maxDate}
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
                    type="button"
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
                    type="button"
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
        {page == 4 ? (
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
              {formErrors.user_city ? (
                <span className="error-msg">{formErrors.user_city}</span>
              ) : null}
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
        {page == 5 ? (
          <>
            {noBinario ? (
              <div className="generos">
                <ListGroup as="ul" className="all_generos">
                  {generos.map((e, idx) => (
                    <ListGroup.Item
                      as="li"
                      key={idx}
                      onClick={() => gender(e)}
                      className={e === userRegister?.gender ? "active" : ""}
                    >
                      {e}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Button onClick={()=>setNoBinario(false)}>Atras</Button>
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
        {/* SPORTS */}
        {page == 6 ? (
          <>
            <Form.Group controlId="formSportId">
              <Form.Label>Deporte</Form.Label>
              <ListGroup as="ul" className="all_generos">
                {sports.map((e, idx) => {
                  return (
                    <>
                      {selectedSport.includes(e.sport_id) ? (
                        <ListGroup.Item
                          as="li"
                          key={idx}
                          onClick={() => removeSports(e.sport_id)}
                          active
                        >
                          {e.sport_name}
                        </ListGroup.Item>
                      ) : (
                        <ListGroup.Item
                          as="li"
                          key={idx}
                          onClick={() => addSports(e.sport_id)}
                        >
                          {e.sport_name}
                        </ListGroup.Item>
                      )}
                    </>
                  );
                })}
                <ListGroup.Item onClick={addSportStatus}>
                  Añadir Deporte
                </ListGroup.Item>
              </ListGroup>
            </Form.Group>
            <ModalCreateSport
              show={modalAddSports}
              closeModal={addSportStatus}
              onSportCreated={handleSportCreated}
              existingSports={sports} //pasamos la lista de deportes existentes al modal
            />
            <Button onClick={volver}>Volver</Button>
            {selectedSport.length > 5 || selectedSport.length < 1 ? (
              <Button className="button-color">Continuar</Button>
            ) : (
              <Button onClick={() => addUserSportsContinuar(selectedSport)}>
                Continuar
              </Button>
            )}
          </>
        ) : null}
        {/* DESCRIPCION */}
        {page == 7 ? (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Describete</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter your text here"
                onChange={handleRegister}
                name="description"
              />
            </Form.Group>
            <Button onClick={volver}>Volver</Button>
            <Button onClick={continuar}>Continuar</Button>
          </>
        ) : null}
        {/* FOTO */}
        {page == 8 ? (
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
            <Button onClick={onSubmit}>Continuar</Button>
          </>
        ) : null}
      </Form>
      <ModalCreateSport
        addSports={addSports}
        show={showModal}
        closeModal={() => setShowModal(false)}
        onSportCreated={handleSportCreated}
        existingSports={sports} //pasamos la lista de deportes existentes al modal
      />
    </Container>
  );
};
