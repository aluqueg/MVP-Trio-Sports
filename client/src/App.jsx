import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container} from 'react-bootstrap'
import { AppRoutes } from './routes/AppRoutes';

function App() {

  return (
    <Container fluid>
      <AppRoutes />
    </Container>
  )
}

export default App
