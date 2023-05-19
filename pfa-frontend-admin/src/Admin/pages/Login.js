import React, { useEffect, useState } from "react";
import "./Styles/login.css";
import logo from "../logos/logo-ensaj.png";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const Login = ({ setUser }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [accountErrors, setAccountErrors] = useState("");

  const shouldRedirect = localStorage.getItem("auth_token");
  const navigate = useNavigate();

  useEffect(() => {
    if (shouldRedirect) {
      navigate("/");
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!login || !password) return;
    axios.get("/sanctum/csrf-cookie").then((response) => {
      axios
        .post("/api/login", { login: login, password: password })
        .then((response) => {
          if (response.data.status === 200) {
            if (
              response.data.role !== "Admin Scolarité" &&
              response.data.role !== "Admin Examen"
            ) {
              setAccountErrors(
                "Vous n'êtes pas autorisé à accéder à cette plateforme."
              );
              return;
            }
            localStorage.setItem("auth_token", response.data.token);
            localStorage.setItem("auth_id", response.data.id);
            localStorage.setItem("user", JSON.stringify(response.data));
            setUser(JSON.parse(localStorage.getItem("user")));
            navigate("/");
          } else if (response.data.status === 401) {
            setAccountErrors(response.data.message);
          } else if (response.data.status === 403) {
            setAccountErrors(response.data.message);
          } else {
            setErrors(response.data.validation_errors);
          }
        });
    });
  };
  return (
    <div className="container">
      <div className="wrapper">
        <div className="title">
          <img src={logo}></img>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="row">
            <i className="fas fa-user" />
            <input
              type="text"
              placeholder="Identifiant"
              id="login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
            <span style={{ color: "red" }}>{errors.login}</span>
          </div>
          <div className="row">
            <i className="fas fa-lock" />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              required
            />
            <span style={{ color: "red" }}>{errors.password}</span>
          </div>
          <span style={{ color: "red" }}>{accountErrors}</span>
          <div className="btn-pass">
            <div className="row button">
              <input type="submit" value="Connexion" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
