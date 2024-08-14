import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { AppRoutes } from './routes/AppRoutes';
import { TrioContextProvider } from './context/TrioContextProvider';
import { Container } from 'react-bootstrap';

function App() {

  return (
    <Container fluid>
      <TrioContextProvider>
        <AppRoutes/>
      </TrioContextProvider>
    </Container>
  )
}

export default App
