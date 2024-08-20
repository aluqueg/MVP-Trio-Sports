import { createContext, useState,useEffect } from "react"
import axios from 'axios'
import { jwtDecode } from "jwt-decode"

export const TrioContext = createContext()

export const TrioContextProvider = ({children}) => {

  const [user,setUser] = useState({})
  const [token,setToken] = useState();
  const [sports, setSports] = useState([]);

  useEffect(()=>{
    const tokenLocal = localStorage.getItem("token")
    if(tokenLocal){
      const {id} = jwtDecode(tokenLocal);
      axios.get("http://localhost:4000/api/users/profile",{headers: {Authorization:`Bearer ${tokenLocal}`}})
      .then(res=>{
        setUser(res.data)
        setToken(tokenLocal)
      })
      .catch(err=>{
        console.log(err)
      })
    }
  },[])

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/sports/allSports"
        );
        console.log("useEffect deportes bd", response.data);
        //ordenamos los deportes alfabéticamente
        const sortedSports = response.data.sort((a, b) => a.sport_name.localeCompare(b.sport_name));
        setSports(sortedSports); // Guardar los deportes en el estado
      } catch (error) {
        console.error("Error al cargar los deportes:", error);
      }
    };

    fetchSports();
  }, []);


  return (
    <>
      <TrioContext.Provider value={{user,setUser,token,setToken, sports, setSports}}>
        {children}
      </TrioContext.Provider>
    </>
  )
}
