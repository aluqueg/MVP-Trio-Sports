import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home/Home";
import { AllActivities } from "../pages/AllActivities/AllActivities";
import { Activity } from "../pages/Activity/Activity";
import { AddActivity } from "../pages/AddActivity/AddActivity";
import { AllUsers } from "../pages/AllUsers/AllUsers";
import { Chats } from "../pages/Chats/Chats";
import { Profile } from "../pages/Profile/Profile";
import { ErrorPage } from "../pages/ErrorPage/ErrorPage";
import { Login } from "../pages/Auth/Login/Login";
import { Container, Row } from "react-bootstrap";
import { NavBarApp } from "../components/NavBarApp/NavBarApp";
import { Register } from "../pages/Auth/Register/Register";
import { AddSport } from "../pages/AddSport/AddSport";
import { UserActivities } from "../pages/Profile/UserActivities/UserActivities";
import { UserParticipatedActivities } from "../pages/Profile/UserParticipatedActivities/UserParticipatedActivities";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Row>
        <NavBarApp />
      </Row>
      <Container fluid="xl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/allActivities" element={<AllActivities />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/addSport" element={<AddSport />} />
          <Route path="/addActivity" element={<AddActivity />} />
          <Route path='/allUsers' element={<AllUsers />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/profile" element={<Profile />}>
            <Route index element={<UserActivities />} />
            <Route path="1" element={<UserParticipatedActivities />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
};
