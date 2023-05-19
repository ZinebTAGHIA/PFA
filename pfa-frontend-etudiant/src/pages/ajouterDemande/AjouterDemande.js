import React, { useEffect, useState } from "react";
import { Form, Field } from "react-final-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import "./ajouterDemande.css";
import { Link } from "react-router-dom";
import { Panel } from "primereact/panel";
import "primereact/resources/primereact.min.css";
import { Dropdown } from "primereact/dropdown";
import axios from "../../api/axios";
// import "/node_modules/primeflex/primeflex.css";

const AjouterDemande = ({ user }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedDemande, setSelectedDemande] = useState();

  const demandes = [
    {
      label: "Demandes de type scolarité",
      code: "scolarité",
      items: [
        { label: "Certificat de scolarité", value: "Certificat de scolarité" },
        {
          label: "Attestation de scolarité",
          value: "Attestation de scolarité",
        },
        { label: "Convention de stage", value: "Convention de stage" },
      ],
    },
    {
      label: "Demandes de type examen",
      code: "examen",
      items: [
        { label: "Relevé de notes", value: "Relevé de notes" },
        { label: "Retrait du Bac", value: "Retrait du Bac" },
        { label: "Retrait du diplôme", value: "Retrait du diplôme" },
      ],
    },
  ];

  const demandesData = [
    {
      objet: "Certificat de scolarité",
      type: "scolarité",
    },
    {
      objet: "Attestation de scolarité",
      type: "scolarité",
    },
    {
      objet: "Convention de stage",
      type: "scolarité",
    },
    {
      objet: "Relevé de notes",
      type: "examen",
    },
    {
      objet: "Retrait du Bac",
      type: "examen",
    },
    {
      objet: "Retrait du diplôme",
      type: "examen",
    },
  ];

  const validate = (data) => {
    let errors = {};

    if (!selectedDemande) {
      errors.demandes = "Ce champ est obligatoire.";
    }

    return errors;
  };

  const onSubmit = () => {
    if (selectedDemande) {
      const type = demandesData.find(
        (element) => element.objet === selectedDemande
      ).type;

      axios
        .post(`/api/demandes`, {
          type: type,
          user_id: user.id,
          objet: selectedDemande,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
      setFormData(selectedDemande);
      setShowMessage(true);
      setSelectedDemande("");
    }
  };

  const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
  const getFormErrorMessage = (meta) => {
    return (
      isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>
    );
  };

  const dialogFooter = (
    <div className="flex justify-content-center">
      <Button
        label="OK"
        className="p-button-text"
        autoFocus
        onClick={() => setShowMessage(false)}
      />
    </div>
  );

  const groupedItemTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <div>{option.label}</div>
      </div>
    );
  };

  return (
    <div>
      <main>
        <h1 className="title"> Effectuer une demande </h1>
        <div style={{ marginBottom: 40 }}>
          <ul className="breadcrumbs">
            <li>
              <Link to="/">Accueil</Link>
            </li>
            <li className="divider">/</li>
            <li>
              <a href="#" className="active">
                Effectuer une demande
              </a>
            </li>
          </ul>
        </div>
        <div className="form-container">
          <Panel header="Formulaire">
            <div className="form">
              <Dialog
                visible={showMessage}
                onHide={() => setShowMessage(false)}
                position="top"
                footer={dialogFooter}
                showHeader={false}
                breakpoints={{ "960px": "80vw" }}
                style={{ width: "30vw" }}
              >
                <div
                  className="flex align-items-center flex-column pt-6 px-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <i
                    className="pi pi-check-circle"
                    style={{ fontSize: "5rem", color: "var(--green-500)" }}
                  ></i>
                  <h5>Demande effectuée avec succès!</h5>
                </div>
              </Dialog>
              <div
                className="flex justify-content-center"
                style={{ justifyContent: "center" }}
              >
                <div className="card">
                  <Form
                    onSubmit={onSubmit}
                    initialValues={{
                      demandes: "",
                    }}
                    validate={validate}
                    render={({ handleSubmit }) => (
                      <form onSubmit={handleSubmit} className="p-fluid">
                        <Field
                          name="demandes"
                          render={({ input, meta }) => (
                            <div className="field">
                              <span className="p-float-label">
                                <Dropdown
                                  id="demandes"
                                  {...input}
                                  value={selectedDemande}
                                  onChange={(e) => {
                                    setSelectedDemande(e.value);
                                  }}
                                  options={demandes}
                                  optionLabel="label"
                                  optionGroupLabel="label"
                                  optionGroupChildren="items"
                                  optionGroupTemplate={groupedItemTemplate}
                                  className="w-full md:w-14rem"
                                  placeholder="Sélectionner une demande"
                                />
                                <label
                                  htmlFor="demandes"
                                  className={classNames({
                                    "p-error": isFormFieldValid(meta),
                                  })}
                                >
                                  Sélectionner une demande*
                                </label>
                              </span>
                              {getFormErrorMessage(meta)}
                            </div>
                          )}
                        />

                        <Button
                          type="submit"
                          label="Enregistrer"
                          className="mt-2"
                          style={{
                            backgroundColor: "rgb(79, 70, 229)",
                            borderColor: "rgb(79, 70, 229)",
                          }}
                        />
                      </form>
                    )}
                  />
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </main>
    </div>
  );
};

export default AjouterDemande;
