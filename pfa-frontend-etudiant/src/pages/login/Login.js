import React, { useEffect, useState } from "react";
import "./login.css";
import loginImg from "../../assets/ensaj.png";
import logoImg from "../../assets/logo-ensaj.png";
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
            if (response.data.role !== "Etudiant") {
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
    <div className="relative w-full h-screen bg-zinc-900/90">
      <img
        className="absolute w-full h-full object-cover mix-blend-overlay"
        src={loginImg}
        alt="/"
      />

      <div className="flex justify-center items-center h-full">
        <form
          className="max-w-[400px] w-full mx-auto bg-white p-4"
          style={{ zIndex: 999 }}
          onSubmit={handleSubmit}
        >
          <div className="text-4xl font-bold text-center py-6">
            <img src={logoImg} alt="ENSAJ" style={{ margin: "auto" }} />
          </div>
          <div className="flex flex-col py-2">
            <label>Login</label>
            <input
              className="border p-2"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
            <span style={{ color: "red" }}>{errors.login}</span>
          </div>
          <div className="flex flex-col py-2">
            <label>Mot de passe</label>
            <input
              className="border p-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span style={{ color: "red" }}>{errors.password}</span>
          </div>
          <span style={{ color: "red" }}>{accountErrors}</span>
          <button className="border w-full my-5 py-2 bg-indigo-600 hover:bg-[#6366F1] text-white">
            Connexion
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
