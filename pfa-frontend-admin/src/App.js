import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Admin/pages/Dashboard";
import SharedLayout from "./Admin/pages/SharedLayout";
import DemandesAttente from "./Admin/pages/DemandesAttente";
import DemandesValid from "./Admin/pages/DemandesValid";
import DemandesRefus from "./Admin/pages/DemandesRefus";
import ComptesActiv from "./Admin/pages/ComptesActiv";
import ComptesDesactiv from "./Admin/pages/ComptesDesactiv";
import Error from "./Admin/pages/Error";
import AjouterCompte from "./Admin/pages/AjouterCompte";
import Profil from "./Admin/pages/Profil";
import Login from "./Admin/pages/Login";
import ProtectedRoute from "./Admin/pages/ProtectedRoute";
import axios from "./api/axios";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [role, setRole] = useState("");


  const handleClick = (e) => {
    const profile = document.querySelector("nav .profile");
    if (profile) {
      const imgProfile = profile.querySelector("img");
      const dropdownProfile = profile.querySelector(".profile-link");
      if (e.target !== imgProfile) {
        if (e.target !== dropdownProfile) {
          if (dropdownProfile.classList.contains("show")) {
            dropdownProfile.classList.remove("show");
          }
        }
      }
    }
  };

  return (
    <div className="App" onClick={handleClick}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute user={user}>
                <SharedLayout
                  setRole={setRole}
                  role={role}
                  setUser={setUser}
                  user={user}
                />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard user={user} />} />
            <Route
              path="demandes-attente"
              element={<DemandesAttente />}
            />
            <Route
              path="demandes-validees"
              element={<DemandesValid />}
            />
            <Route
              path="demandes-refusees"
              element={<DemandesRefus/>}
            />
            <Route path="comptes-actives" element={<ComptesActiv />} />
            <Route path="comptes-desactives" element={<ComptesDesactiv />} />
            <Route path="ajouter-etudiant" element={<AjouterCompte />} />
            <Route
              path="infos-perso"
              element={<Profil user={user} setUser={setUser} />}
            />
          </Route>
          <Route path="login" element={<Login setUser={setUser} />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
