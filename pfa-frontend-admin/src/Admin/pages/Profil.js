import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "primereact/card";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import "./Styles/profil.css";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import axios from "../../api/axios";

const Profil = (props) => {
  const toast = useRef(null);
  const [data, setData] = useState();
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    axios
      .get(`/api/users/${props.user.id}`)
      .then((response) => setData(response.data.data))
      .catch((error) => console.error(error));
  }, []);

  const onModifierClick = () => {
    const inputs = document.querySelectorAll(".text-base");
    inputs.forEach((input) => {
      input.disabled = false;
    });
    const inputEmail = document.getElementById("email");
    inputEmail.focus();
    const btnEnregistrer = document.getElementById("btn-enregistrer");
    btnEnregistrer.classList.remove("hide");
  };

  const acceptFunc = (newData) => {
    axios
      .put(`/api/users/${props.user.id}`, {
        nom: newData.nom,
        prenom: newData.prenom,
        email: newData.email,
        tel: newData.tel,
        password: newData.password,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get(`/api/users/${props.user.id}`)
      .then((response) => setData(response.data.data))
      .catch((error) => console.error(error));

    toast.current.show({
      severity: "info",
      summary: "Confirmé",
      detail: "Vous avez accepté",
      life: 3000,
    });
  };

  const reject = () => {
    toast.current.show({
      severity: "warn",
      summary: "Rejeté",
      detail: "Vous avez refusé",
      life: 3000,
    });
  };
  const confirm1 = (newData) => {
    confirmDialog({
      message: "Êtes-vous sûr de vouloir modifier vos informations?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-primary",
      accept: () => acceptFunc(newData),
      reject,
    });
  };

  const onUpdate = () => {
    const nom = document.getElementById("nom").value;
    const prenom = document.getElementById("prenom").value;
    const email = document.getElementById("email").value;
    const tel = document.getElementById("tel").value;
    const password = document.getElementById("password").value;

    let newData = {};
    if (password === "") {
      newData = { nom, prenom, email, tel };
    } else {
      newData = { nom, prenom, email, tel, password };
    }

    if (
      nom !== props.user.id ||
      prenom !== props.user.id ||
      email !== props.user.id ||
      tel !== props.user.id ||
      password !== ""
    ) {
      confirm1(newData);
    }
    return;
  };

  const uploadPhoto = async () => {
    console.log(photo);
    axios
      .post(
        `/api/users/edit-photo/${props.user.id}`,
        { photo: photo },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get(`/api/users/${props.user.id}`)
      .then((response) => {
        setData(response.data.data);
        props.setUser(response.data.data);
      })
      .catch((error) => console.error(error));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await uploadPhoto();
  };
  return (
    <div>
      <main>
        {!data ? (
          <ProgressSpinner />
        ) : (
          <>
            {" "}
            <h1 className="title">Profil</h1>
            <ul className="breadcrumbs">
              <li>
                <Link to="/">Accueil</Link>
              </li>
              <li className="divider">/</li>
              <li>
                <a href="#" className="active">
                  Profil
                </a>
              </li>
            </ul>
            <div className="grid">
              <div
                className="imgContainer col-3 md:col2"
                style={{ margin: 30 }}
              >
                <Card>
                  <img
                    src={
                      data.photo
                        ? `http://127.0.0.1:8000/storage/${data.photo}`
                        : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt="Photo"
                    id="user-image"
                  />
                  <div>
                    {data.nom} {data.prenom}
                  </div>
                  <Toast ref={toast}></Toast>
                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <input
                      type="file"
                      id="photo"
                      name="photo"
                      accept="image/png, image/jpeg"
                      onChange={(e) => setPhoto(e.target.files[0])}
                    ></input>
                    <Button
                      type="submit"
                      label="Enregistrer"
                      className="mt-2"
                      style={{
                        backgroundColor: "#1775f1",
                        borderColor: "#1775f1",
                      }}
                    />
                  </form>
                </Card>
              </div>
              <div className="settings col-8">
                <Card title="Infos personnelles">
                  <div className="card">
                    <div className="formgrid grid">
                      <div className="field col-12 md:col-6">
                        <label htmlFor="nom">Nom</label>
                        <input
                          id="nom"
                          type="text"
                          className=" text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                          disabled
                          defaultValue={data.nom}
                        />
                      </div>
                      <div className="field col-12 md:col-6">
                        <label htmlFor="prenom">Prénom</label>
                        <input
                          id="prenom"
                          type="text"
                          className=" text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                          disabled
                          defaultValue={data.prenom}
                        />
                      </div>
                      <div className="field col-12 md:col-6">
                        <label htmlFor="cin">CIN</label>
                        <input
                          id="cin"
                          type="text"
                          className=" text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                          disabled
                          defaultValue={data.CIN}
                        />
                      </div>
                      <div className="field col-12 md:col-6">
                        <label htmlFor="email">Email</label>
                        <input
                          id="email"
                          type="text"
                          className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                          disabled
                          defaultValue={data.email}
                        />
                      </div>
                      <div className="field col-12 md:col-6">
                        <label htmlFor="tel">Tel</label>
                        <input
                          id="tel"
                          type="text"
                          className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                          disabled
                          defaultValue={data.tel}
                        />
                      </div>
                      <div className="field col-12 md:col-6">
                        <label htmlFor="password">Mot de passe</label>
                        <input
                          id="password"
                          type="password"
                          className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                          disabled
                          defaultValue={""}
                        />
                      </div>
                      <div className="field col-12 md:col-3">
                        <button
                          type="button"
                          className="text-white px-3 py-2 text-base border-1 border-solid border-round cursor-pointer transition-all transition-duration-200"
                          id="btn-modifier"
                          onClick={onModifierClick}
                        >
                          Modifer
                        </button>
                      </div>
                      <div className="field col-12 md:col-3">
                        <Toast ref={toast} />
                        <ConfirmDialog />
                        <Button
                          onClick={onUpdate}
                          label="Enregistrer"
                          className="mr-2 hide"
                          id="btn-enregistrer"
                        ></Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Profil;
