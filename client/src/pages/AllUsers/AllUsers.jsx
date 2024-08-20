import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Button from "react-bootstrap/esm/Button";
import { TrioContext } from "../../context/TrioContextProvider";
import { useContext, useEffect, useState } from "react";
import { CardOneUser } from "../../components/CardOneUser/CardOneUser";
import axios from "axios";
import {gender} from '../../helpers/genderData'
import { differenceInYears, format } from "date-fns";

export const AllUsers = () => {
  const { user, token, setToken, sports, setSports } = useContext(TrioContext);
  const [allUsers, setAllUsers] = useState([])
  const [filteredUsers, setFilteresUsers] = useState(allUsers)
  const [selectedSport, setSelectedSport] = useState("")
  const [age, setAge] = useState("")
  const [selectedGender, setSelectedGender] = useState("")
  const [location, setLocation] = useState("")



  useEffect(()=>{
    const peticionUserSports = async () =>{
      try{
        const res = await axios.get('http://localhost:4000/api/users/getAllUsers', {headers: {Authorization: `Bearer ${token}`}})
        setAllUsers(res.data)
        console.log(res);                
        let userBirthDate = (res.data.birth_date)
        let today = new Date()
        let userAge = differenceInYears(today, userBirthDate)
        setAge(userAge)                               
      }catch(err){
        console.log(err);        
      }
    }
    peticionUserSports();
  },[])

  const handleClick = () => {
    const filtered = allUsers.filter(user => {
      return(
        (selectedSport ? user.sports.includes(selectedSport) === selectedSport: true) &&
        (age ? user.age === parseInt(age): true ) &&
        (selectedGender ? user.gender === selectedGender: true) &&
        (location ? user.user_city.includes(location): true)
      )
    })
    setFilteresUsers(filtered)  
    console.log("handleClick");
    console.log(selectedSport);
    console.log(age)    
    console.log(selectedGender)
    console.log(location)
  }


  
  return (
    <div>
      <div className="d-flex justify-content-center gap-5">
        <DropdownButton id="deporte" title="Deporte" onSelect={(e) => setSelectedSport(e)}>
          {sports.map((e)=>{
            return(
              <Dropdown.Item key={e.sport_id} eventKey={e.sport_name}>{e.sport_name}</Dropdown.Item>
            )
          })}

        </DropdownButton>
        <input
          className="rounded-5" 
          type="text"
          placeholder="Edad"
          value={age || ""}
          onChange={(e)=>setAge(e.target.value)}
          />
        <DropdownButton id="sexo" title="Sexo" onSelect={(e) => setSelectedGender(e)}>          
            {gender.map((e, index)=>{
              return(
                <Dropdown.Item key={index} eventKey={e}>{e}</Dropdown.Item>
              )
            })}

        </DropdownButton>
        <input 
          className="rounded-5" 
          type="text"
          placeholder="Ubicación"
          value={location}
          onChange={(e)=>setLocation(e.target.value)}
          />
        <Button 
          className="rounded-5"
          onClick={handleClick}          
          >Buscar</Button>
      </div>
      <hr />

          {filteredUsers ? filteredUsers.map((e, index)=>{
            return(
              <CardOneUser key={index} data={e} /> 
            )
          }): null}
    </div>
  );
};
