import { useOutletContext, useNavigate } from 'react-router-dom'
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap'

export const Email = () => {
  const[userRegister,setUserRegister,handleRegister] = useOutletContext()
  const navigate = useNavigate()
  return (
    <div>
      <h1>CUAL ES TU EMAIL</h1>
      <Form action=''>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Enter email" name='email' onChange={handleRegister} value={userRegister?.email}/>
          <Form.Text className="text-muted">
          </Form.Text>
        </Form.Group>
        <Button onClick={()=>navigate("/register/name")}>Siguiente</Button>
      </Form>
    </div>
  )
}
