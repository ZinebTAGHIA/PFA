import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Dashboard = ({ user }) => {
  useEffect(() => {
    const allProgress = document.querySelectorAll("main .card .progress");

    allProgress.forEach((item) => {
      item.style.setProperty("--value", item.dataset.value);
    });
  }, []);

  return (
    <main>
      <h1 className="title">Accueil</h1>
      <ul className="breadcrumbs">
        <li>
          <Link to="/">Accueil</Link>
        </li>
        <li className="divider">/</li>
        <li>
          <a href="#" className="active">
            Accueil
          </a>
        </li>
      </ul>
      <div className="info-data">
        <Link to="/notifications">
          <div className="card">
            <div className="head">
              <div>
                <i className="bx bx-bell bx-md"></i>
                <p>Notifications</p>
              </div>
            </div>
          </div>
        </Link>
        <Link to="demandes-attente">
          <div className="card">
            <div className="head">
              <div>
                <i className="bx bxs-hourglass-top bx-md"></i>
                <p>Demandes en attentes</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
      <div className="info-data">
        <Link to="/demandes-validees">
          <div className="card">
            <div className="head">
              <div>
                <i className="bx bx-check bx-md"></i>
                <p>Demandes validées</p>
              </div>
            </div>
          </div>
        </Link>
        <Link to="/demandes-refusees">
          <div className="card">
            <div className="head">
              <div>
                <i className="bx bxs-trash bx-md"></i>
                <p>Demandes refusées</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
      <div className="info-data">
        <Link to="/ajouter-demande">
          <div className="card">
            <div className="head">
              <div>
                <i className="bx bx-edit bx-md"></i>
                <p>Effectuer une demande</p>
              </div>
            </div>
          </div>
        </Link>
        <Link to="/profil">
          <div className="card">
            <div className="head">
              <div>
                <i className="bx bxs-user bx-md"></i>
                <p>Profil</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </main>
  );
};

export default Dashboard;
