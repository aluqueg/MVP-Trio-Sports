import { format, getMonth, getYear, subYears } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { Form, ListGroup } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { TrioContext } from "../../context/TrioContextProvider";
import DatePicker from "react-datepicker";
import { es } from "date-fns/locale/es";
import { ModalCreateSport } from "../ModalCreateSport/ModalCreateSport";
import axios from "axios";
import * as formik from 'formik';
import * as yup from 'yup';

function ModalEditUser({ show, handleClose, data, token, practiceSports }) {
  const [editUser, setEditUser] = useState(data);
  const [formErrors, setFormErrors] = useState({});
  const [sportId, setSportId] = useState("");
  const { sports, setSports } = useContext(TrioContext);

  const handleEditUser = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
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

  const [startDate, setStartDate] = useState(editUser?.birth_date);
  const maxDate = subYears(new Date(), 18);
  const years = range(1990, getYear(new Date()) + 1, 1);
  const lastLogDate = format(startDate, `yyyy-MM-dd HH-mm-ss`);

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
    setEditUser({ ...editUser, gender: genero });
  };

  /* SPORTS */

  const [modalAddSports, setModalAddSports] = useState(false);
  const addSportStatus = () => setModalAddSports(!modalAddSports);
  const [selectedSport, setSelectedSport] = useState([]);

  /* VALIDATION */

  useEffect(()=>{
    axios
        .get(`http://localhost:4000/api/users/getPracticeSports`,{headers:{Authorization: `Bearer ${token}`}})
        .then(res=>{
          setSelectedSport(res.data?.map(sports => sports.sport_id))
        })
        .catch(err=>{console.log(err)})
  },[])

  const addSports = (e) => {
    setSelectedSport([...selectedSport, e]);
  };

  const removeSports = (e) => {
    setSelectedSport(selectedSport.filter((sport) => sport !== e));
  };

  const handleCheckboxChange = (sportId) => {
    selectedSport.includes(sportId) ? removeSports(sportId) : addSports(sportId);
  };

  const handleSportCreated = (newSport) => {
    setSports((prevSports) => [...prevSports, newSport]);
    setSportId(newSport.sport_id); //Selecciona automáticamente el nuevo deporte
  };

  const onEditSubmit = () => {
    setEditUser({...editUser, ["sports"]: selectedSport})
    console.log("submit editUser",editUser)
    console.log("submit selectSports", selectedSport);
    axios
      .put('http://localhost:4000/api/users/editUser', editUser, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res);
        // handleClose();
      })
      .catch((err) => console.log(err));
  };
  console.log(selectedSport)
  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* EMAIL */}

          <Form action="">

            {/* EMAIL */}

            <>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={editUser?.email}
                  disabled
                />
                <Form.Text className="text-muted"></Form.Text>
              </Form.Group>
            </>

            {/* NOMBRE */}

            <>
              <Form.Group className="mb-3" controlId="user_name">
                <Form.Label>NOMBRE</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  name="user_name"
                  onChange={handleEditUser}
                  value={editUser?.user_name}
                  required
                />
                {formErrors.user_name ? (
                  <span className="error-msg">{formErrors.user_name}</span>
                ) : null}
                <Form.Text className="text-muted"></Form.Text>{" "}
              </Form.Group>
            </>

            {/* APELLIDOS */}

            <>
              <Form.Group className="mb-3" controlId="user_name">
                <Form.Text className="text-muted"></Form.Text>
                <Form.Group className="mb-3" controlId="last_name">
                  <Form.Label>APELLIDOS</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    name="last_name"
                    onChange={handleEditUser}
                    value={editUser?.last_name}
                  />
                  {formErrors.last_name ? (
                    <span className="error-msg">{formErrors.last_name}</span>
                  ) : null}
                </Form.Group>
                <Form.Text className="text-muted"></Form.Text>{" "}
              </Form.Group>
            </>

            {/* CUMPLEAÑOS */}

            <>
              <Form.Label className="mb-3 me-3">CUMPLEAÑOS</Form.Label>
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
            </>

            {/* CIUDAD */}
            <>
              <Form.Group className="mb-3" controlId="user_city">
                <Form.Label>CUAL ES TU CIUDAD</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="cual es tu ciudad"
                  name="user_city"
                  onChange={handleEditUser}
                  value={editUser?.user_city}
                />
                {formErrors.user_city ? (
                  <span className="error-msg">{formErrors.user_city}</span>
                ) : null}
                <Form.Text className="text-muted"></Form.Text>
              </Form.Group>
            </>

            {/* GENERO */}

            <>
              <Form.Label className="mb-3">GENERO</Form.Label>
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
                  <Button onClick={() => setNoBinario(false)}>Volver</Button>
                </div>
              ) : (
                <div className="generos">
                  <Button onClick={() => gender("Hombre")}>Hombre</Button>
                  <Button onClick={() => gender("Mujer")}>Mujer</Button>
                  <Button onClick={selectNobinario}>No Binario</Button>
                </div>
              )}
            </>

            {/* SPORTS */}

            <>
              <Form.Group controlId="formSportId">
                <Form.Label className="my-3">DEPORTES</Form.Label>
                <div style={{ maxHeight: "100px", overflowY: "auto" }}>
                  {sports.map((e, idx) => (
                    <Form.Check
                      key={idx}
                      type="checkbox"
                      label={e.sport_name}
                      checked={selectedSport.includes(e.sport_id)}
                      onChange={() =>
                        handleCheckboxChange(e.sport_id)
                      }
                    />
                  ))}
                </div>
                <Button onClick={addSportStatus}>Añadir deporte</Button>
              </Form.Group>
              <ModalCreateSport
                show={modalAddSports}
                closeModal={addSportStatus}
                onSportCreated={handleSportCreated}
                existingSports={sports} //pasamos la lista de deportes existentes al modal
              />
            </>

            {/* DESCRIPTION */}

            <>
              <Form.Group className="my-3" controlId="user_city">
                <Form.Label>DESCRIPCIÓN</Form.Label>
                <Form.Control
                  type="textarea"
                  placeholder="Cuentanos más sobre ti..."
                  name="description"
                  onChange={handleEditUser}
                  value={editUser?.description}
                />
                {formErrors.user_city ? (
                  <span className="error-msg">{formErrors.user_city}</span>
                ) : null}
                <Form.Text className="text-muted"></Form.Text>
              </Form.Group>
            </>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={onEditSubmit}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalEditUser;
