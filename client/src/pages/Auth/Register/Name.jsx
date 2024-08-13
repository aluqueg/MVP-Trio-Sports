import { useOutletContext,useNavigate } from 'react-router-dom'
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap'

export const Name = () => {
  const[userRegister,setUserRegister,handleRegister] = useOutletContext()
  const navigate = useNavigate()
  return (
    <div>
      <h1>NOMBRE Y APELLIDOS</h1>
      <Form action=''>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>NOMBRE</Form.Label>
          <Form.Control type="text" placeholder="Enter name" name='name' onChange={handleRegister} value={userRegister?.name}/>
          <Form.Text className="text-muted">
          </Form.Text>
          <Form.Label>APELLIDOS</Form.Label>
          <Form.Control type="text" placeholder="Enter name" name='lastName' onChange={handleRegister} value={userRegister?.lastName}/>
          <Form.Text className="text-muted">
          </Form.Text>
        </Form.Group>
        <Button onClick={()=>navigate("/register")}>atras</Button>
      </Form>
    </div>
  )
}
