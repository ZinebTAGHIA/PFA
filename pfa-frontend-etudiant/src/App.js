import logo from "./logo.svg";
import "./App.css";
import Login from "./pages/login/Login";
import { useEffect, useState } from "react";
import ProtectedRoute from "./pages/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import DemandesAttente from "./pages/DemandesAttente";
import DemandesValid from "./pages/DemandesValid";
import DemandesRefus from "./pages/DemandesRefus";
import Profil from "./pages/profil/Profil";
import SharedLayout from "./pages/SharedLayout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Error from "./pages/Error";
import AjouterDemande from "./pages/ajouterDemande/AjouterDemande";
import Notifications from "./pages/notifications/Notifications";
import axios from './api/axios';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

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
                <SharedLayout setUser={setUser} user={user} />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard user={user} />} />
            <Route
              path="demandes-attente"
              element={<DemandesAttente user={user} />}
            />
            <Route
              path="demandes-validees"
              element={<DemandesValid user={user} />}
            />
            <Route
              path="demandes-refusees"
              element={<DemandesRefus user={user} />}
            />
            <Route
              path="ajouter-demande"
              element={<AjouterDemande user={user} />}
            />
            <Route
              path="profil"
              element={<Profil user={user} setUser={setUser} />}
            />
            <Route
              path="notifications"
              element={<Notifications user={user} />}
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
