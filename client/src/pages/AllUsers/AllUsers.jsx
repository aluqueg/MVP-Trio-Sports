import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Button from "react-bootstrap/esm/Button";
import { TrioContext } from "../../context/TrioContextProvider";
import { useContext } from "react";
import { CardOneUser } from "../../components/CardOneUser/CardOneUser";

export const AllUsers = () => {
  const { user } = useContext(TrioContext);

  return (
    <div>
      <div className="d-flex">
        <DropdownButton id="deporte" title="Deporte">
          <Dropdown.Item href="#/action-1">Baloncesto</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Balonmano</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Baseball</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Calistenia</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Ciclismo</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Escalada</Dropdown.Item>
        </DropdownButton>
        <input type="text"></input>
        <DropdownButton id="sexo" title="Sexo">
          <Dropdown.Item href="#/action-1">Hombre</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Mujer</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Otro</Dropdown.Item>
        </DropdownButton>
        <input type="text"></input>
        <Button>Buscar</Button>
      </div>
      <hr />

      <CardOneUser />
    </div>
  );
};
