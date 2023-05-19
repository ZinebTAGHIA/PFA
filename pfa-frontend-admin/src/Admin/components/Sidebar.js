import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "../../api/axios";

const Sidebar = (props) => {
  const handleMouseEnter = () => {
    const allSideDivider = document.querySelectorAll("#sidebar .divider");

    if (props.isSidebarHiden) {
      const activeLinks = document.querySelector(".side-menu a.active");
      if (activeLinks) {
        // activeLinks.classList.remove("active");
      }

      allSideDivider.forEach((item) => {
        item.textContent = item.dataset.text;
      });
    }
  };

  const handleMouseLeave = () => {
    const allSideDivider = document.querySelectorAll("#sidebar .divider");

    if (props.isSidebarHiden) {
      document.querySelectorAll(".side-menu li a").forEach((a) => {
        // a.classList.remove("active");
      });

      allSideDivider.forEach((item) => {
        item.textContent = "-";
      });
    }
  };

  return (
    <section
      id="sidebar"
      className={props.isSidebarHiden ? "hide" : ""}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        id="user"
        src={
          props.user.photo
            ? `http://127.0.0.1:8000/storage/${props.user.photo}`
            : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
        }
        alt="Photo"
      />

      <h2 id="username">
        {props.user.nom} {props.user.prenom}
      </h2>
      <h5 id="role" style={{ color: "grey" }}>
        {props.role}
      </h5>
      <ul className="side-menu">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="bx bxs-dashboard icon" /> Accueil
          </NavLink>
        </li>
        <li className="divider" data-text="demandes">
          {props.isSidebarHiden ? "-" : "Demandes"}
        </li>
        <li>
          <NavLink
            to="/demandes-attente"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="bx bxs-hourglass-top icon" />
            Demandes en attente
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/demandes-validees"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="bx bx-check icon" />
            Demandes validées
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/demandes-refusees"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="bx bxs-trash icon" />
            Demandes refusées
          </NavLink>
        </li>
        <li className="divider" data-text="comptes">
          {props.isSidebarHiden ? "-" : "Comptes"}
        </li>
        <li>
          <NavLink
            to="/comptes-actives"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="bx bxs-user-check icon" />
            Comptes activés
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/comptes-desactives"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="bx bxs-user-x icon" /> Comptes désactivés
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/ajouter-etudiant"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="bx bx-user-plus icon" /> Créer un compte
          </NavLink>
        </li>
        <li className="divider" data-text="profil">
          {props.isSidebarHiden ? "-" : "Profil"}
        </li>
        <li>
          <NavLink
            to="/infos-perso"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="bx bxs-user icon" /> Infos personnelles
          </NavLink>
        </li>
      </ul>
    </section>
  );
};

export default Sidebar;
