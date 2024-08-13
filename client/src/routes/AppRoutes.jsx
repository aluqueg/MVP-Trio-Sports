import {BrowserRouter, Route, Routes} from "react-router-dom"
import { Register } from "../pages/Auth/Register/Register"
import { Email } from "../pages/Auth/Register/Email"
import { Name } from "../pages/Auth/Register/Name"


export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Register/>}>
          <Route index element={<Email/>}/>
          <Route path="name" element={<Name/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
