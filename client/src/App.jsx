import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { AppRoutes } from './routes/AppRoutes';
import { TrioContextProvider } from './context/TrioContextProvider';

function App() {

  return (
    <>
    <TrioContextProvider>
      <AppRoutes/>
    </TrioContextProvider>

    </>
  )
}

export default App
