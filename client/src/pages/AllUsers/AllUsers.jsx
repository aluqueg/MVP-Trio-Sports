import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Button from "react-bootstrap/esm/Button";
import { TrioContext } from "../../context/TrioContextProvider";
import { useContext, useEffect, useState } from "react";
import { CardOneUser } from "../../components/CardOneUser/CardOneUser";
import axios from "axios";
import {gender} from '../../helpers/genderData'

export const AllUsers = () => {
  const { user, token, setToken, sports, setSports } = useContext(TrioContext);
  const [allUsers, setAllUsers] = useState({})

  useEffect(()=>{
    const peticionUserSports = async () =>{
      try{
        const res = await axios.get('http://localhost:4000/api/users/getAllUsers', {headers: {Authorization: `Bearer ${token}`}})
        setAllUsers(res.data)                
      }catch(err){
        console.log(err);        
      }
    }
    peticionUserSports();
  },[])

  
  return (
    <div>
      <div className="d-flex">
        <DropdownButton id="deporte" title="Deporte">
          {sports.map((e)=>{
            return(
              <Dropdown.Item key={e.sport_id}>{e.sport_name}</Dropdown.Item>
            )
          })}

        </DropdownButton>
        <input type="text"></input>
        <DropdownButton id="sexo" title="Sexo">          
            {gender.map((e, index)=>{
              return(
                <Dropdown.Item key={index}>{e}</Dropdown.Item>
              )
            })}

        </DropdownButton>
        <input type="text"></input>
        <Button>Buscar</Button>
      </div>
      <hr />

          {allUsers ? {allUsers.map((e, index)=>{
            return(
              <CardOneUser key={index} data={e} /> 
            )
          })}: null}
    </div>
  );
};
