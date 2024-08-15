import React from "react";
import { useNavigate } from "react-router-dom";
import "../Home/home.css";
import "../../components/NavBarApp/navBarApp.css";

export const Home = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="home-wrapper">
      <div className="home-background"></div>
      <div className="home-overlay"></div>
      <div className="home-content">
        <h1 className="home-title">Conectando a través del deporte</h1>
        <button className="nav-pill-button" onClick={handleRegisterClick}>
          Registrarse
        </button>
      </div>
    </div>
  );
};
