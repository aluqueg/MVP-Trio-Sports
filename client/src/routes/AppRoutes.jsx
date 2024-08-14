import {BrowserRouter, Route, Routes} from "react-router-dom"
import { Register } from "../pages/Auth/Register/Register"


export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Register/>}/>
      </Routes>
    </BrowserRouter>
  )
}
