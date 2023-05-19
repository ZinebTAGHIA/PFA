import React from "react";
import logo from "../assets/logo-ensaj.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
const Navbar = (props) => {
  const navigate = useNavigate();

  const handleClickProfile = (e) => {
    const profile = document.querySelector("nav .profile");
    const dropdownProfile = profile.querySelector(".profile-link");
    dropdownProfile.classList.toggle("show");
  };

  const handleToggleSidebarClick = () => {
    const allSideDivider = document.querySelectorAll("#sidebar .divider");
    if (props.isSidebarHiden == false) {
      allSideDivider.forEach((item) => {
        item.textContent = "-";
      });
    } else {
      allSideDivider.forEach((item) => {
        item.textContent = item.dataset.text;
      });
    }
    props.onHidenSidebarChange(!props.isSidebarHiden);
    document.querySelectorAll(".side-dropdown").forEach((dropdown) => {
      dropdown.classList.remove("show");
    });

    document.querySelectorAll(".side-menu li a").forEach((a) => {
      // a.classList.remove("active");
    });
  };

  const onLogout = (e) => {
    e.preventDefault();

    axios.post("/api/logout").then((res) => {
      if (res.data.status === 200) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_id");
        localStorage.removeItem("user");
        navigate("/login");
      }
    });
  };

  return (
    <nav>
      <i
        className="bx bx-menu toggle-sidebar"
        onClick={handleToggleSidebarClick}
      />
      <div className="titleContainer">
        <img src={logo} alt="logo ensaj" />
        <h1 className="title">Gestion des Demandes</h1>
      </div>
      <Link to="/notifications" className="nav-link">
        <i className="bx bxs-bell icon"></i>
      </Link>
      <span className="divider" />
      <div className="profile">
        <img
          src={
            props.user.photo
              ? `http://127.0.0.1:8000/storage/${props.user.photo}`
              : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="Photo"
          onClick={handleClickProfile}
        />
        <ul className="profile-link">
          <li>
            <Link to="/profil">
              <i className="bx bxs-user-circle icon" /> Profil
            </Link>
          </li>
          <li>
            <a href="#" onClick={onLogout}>
              <i className="bx bxs-log-out-circle" /> Déconnexion
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
