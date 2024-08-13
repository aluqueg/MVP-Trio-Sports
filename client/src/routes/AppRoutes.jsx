import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {Home} from '../pages/Home/Home'
import { AllActivities } from '../pages/AllActivities/AllActivities'
import { Activity } from '../pages/Activity/Activity'
import { AddActivity } from '../pages/AddActivity/AddActivity'
import { AllUsers } from '../pages/AllUsers/AllUsers'
import { Chats } from '../pages/Chats/Chats'
import { Profile } from '../pages/Profile/Profile'
import { ErrorPage } from '../pages/ErrorPage/ErrorPage'
import { Login } from '../pages/Auth/Login/Login'
import { Row } from 'react-bootstrap'
import { NavBarApp } from '../components/NavBarApp/NavBarApp'
import { Register } from "../pages/Auth/Register/Register"
import { Email } from "../pages/Auth/Register/Email"
import { Name } from "../pages/Auth/Register/Name"

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Row>
        <NavBarApp />
      </Row>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/allActivities' element={<AllActivities />} />
        <Route path='/activity' element={<Activity />} />
        <Route path='/addActivity' element={<AddActivity />} />
        <Route path='/allUsers' element={<AllUsers />} />
        <Route path='/chats' element={<Chats />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register/>}>
         <Route index element={<Email/>}/>
         <Route path="name" element={<Name/>}/>
        </Route> 
        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  )
}
