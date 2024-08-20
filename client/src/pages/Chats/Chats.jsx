import { useEffect,useContext, useState } from "react"
import { TrioContext } from "../../context/TrioContextProvider";
import axios from "axios";
import "./chats.css";
import { json } from "react-router-dom";
import { format } from "date-fns";
import { CardBody } from "react-bootstrap";

export const Chats = () => {
  const { user, setUser , setToken,token} = useContext(TrioContext)
  const [received, setReceived] = useState([])
  const [viewMessages,setViewMessages] = useState()
  const [currentMessage,setCurrentMessage] = useState()
  const [currentSend,setCurrentSend] = useState() //EL USUARIO AL QUE MANDAR LOS MENSAJES
  useEffect(()=>{
    axios.get("http://localhost:4000/api/users/allMessages", {headers: {Authorization:`Bearer ${token}`}})
    .then(res =>{
      console.log(res)
      setReceived(res.data)
    })
    .catch(error =>{
      console.error(error);
    })
  },[token])
  const viewOneChat = async (senderUserID,userID)=>{
    try{
      const res = await axios.post(`http://localhost:4000/api/users/viewOneChat`, {user_sender_id : senderUserID , user_receiver_id : userID })
      setViewMessages(res.data)
      setCurrentSend(senderUserID)
      console.log(res)
 
    }catch(err){
      console.log(err)
    }
  }
  let today = format(new Date(), "yyyy-MM-dd HH-mm-ss")
  const handleSend = (e)=>{
    const {value} = e.target;
    setCurrentMessage(value)
  }
  const sendMessage = async (texto,time,userReceiver, user) =>{
    try{
      const res = await axios.post('http://localhost:4000/api/users/sendMessage', {message: texto,date: time, receiver: userReceiver, userID: user})
      viewOneChat(currentSend,user)
      setCurrentMessage("")
    } catch(err){
      console.log(err)
    }
  }
  return (
    <>
    <div className="messages">
      <div className="lateral-mensajes">
        MENSAJES
      {received?.map((e,idx)=>{
        return(
          <>
          <div key={idx}>{e.user_name}</div>
          <button onClick={() => viewOneChat(e.user_id,user.user_id)} type="button">ver mensajes </button>
          </>
        )
      })}
      </div>
      <div className="cuerpo-mensajes">
        {viewMessages?.map((e,idx)=>{
          return(
            <div className={e.message_type === "sent" ? "dch" : "izq"} key={idx}>{e.text}</div>
          )
        })}
      </div>
      <textarea id="message" name="message" placeholder="Escribe aquí..." className="chat" onChange={handleSend} value={currentMessage}></textarea>
      <button onClick={()=>sendMessage(currentMessage,today,currentSend,user.user_id)}>ENVIAR</button>
    </div>
    </>
  )
}
