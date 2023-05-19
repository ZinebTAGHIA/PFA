import React, { useEffect, useRef, useState } from "react";
import axios from "../api/axios";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { Link } from "react-router-dom";
import { Card } from "primereact/card";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Field, Form } from "react-final-form";
import { classNames } from "primereact/utils";
import { ProgressSpinner } from "primereact/progressspinner";

const DemandesAttente = ({ user }) => {
  const [data, setData] = useState();
  const [currentDemande, setCurrentDemande] = useState("");
  const [currentID, setCurrentID] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedDemande, setSelectedDemande] = useState("");

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const toast = useRef(null);

  const [visible, setVisible] = useState(false);

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

  useEffect(() => {
    axios
      .get(`/api/demandes/etat/en attente/student/${user.id}`)
      .then((response) => setData(response.data.data))
      .catch((error) => console.error(error));
  }, []);

  const getSeverity = () => {
    return "info";
  };
  const statusBodyTemplate = () => {
    return <Tag value="en attente" severity={getSeverity()} />;
  };

  const operationsBodyTemplate = (rowData) => {
    return (
      <div>
        <div className="card flex justify-content-center">
          <Dialog
            header="Modifier une demande"
            visible={visible}
            style={{ width: "50vw" }}
            onHide={() => setVisible(false)}
          >
            <div className="form">
              <div
                className="flex justify-content-center"
                style={{ justifyContent: "center" }}
              >
                <div className="card">
                  <Form
                    onSubmit={() => onSubmit(currentID)}
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
                          icon="pi pi-check"
                          // onClick={() => console.log(data.id)}
                          autoFocus
                        />
                      </form>
                    )}
                  />
                </div>
              </div>
            </div>
          </Dialog>
        </div>
        <div className="card flex justify-content-between">
          <Button
            onClick={() => confirm1(rowData.id)}
            icon="bx bx-trash"
            label="Annuler"
            className="mr-2"
            severity="danger"
            style={{ marginRight: 20 }}
          ></Button>
          <Button
            icon="bx bx-edit-alt"
            label="Modifier"
            onClick={() => {
              setCurrentDemande(rowData.objet);
              setCurrentID(rowData.id);
              setVisible(true);
            }}
          ></Button>
        </div>
      </div>
    );
  };

  const onGlobalFilterChange = (event) => {
    const value = event.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
  };

  const renderHeader = () => {
    const value = filters["global"] ? filters["global"].value : "";

    return (
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          value={value || ""}
          onChange={(e) => onGlobalFilterChange(e)}
          placeholder="Global Search"
        />
      </span>
    );
  };

  const header = renderHeader();

  const acceptFunc = (id) => {
    axios
      .delete(`/api/demandes/${id}`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get(`/api/demandes/etat/en attente/student/${user.id}`)
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

  const confirm1 = (id) => {
    confirmDialog({
      message: "Êtes-vous sûr de vouloir annuler cette demande?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => acceptFunc(id),
      reject,
    });
  };

  const onSubmit = (id) => {
    if (selectedDemande !== "" && selectedDemande !== currentDemande) {
      const type = demandesData.find(
        (element) => element.objet == selectedDemande
      ).type;
      console.log(type);
      axios
        .put(`/api/demandes/${id}`, {
          type: type,
          objet: selectedDemande,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });

      axios
        .get(`/api/demandes/etat/en attente/student/${user.id}`)
        .then((response) => setData(response.data.data))
        .catch((error) => console.error(error));

      setFormData(selectedDemande);
      setSelectedDemande("");
      setVisible(false);
      setShowMessage(true);
    }
  };

  const validate = (data) => {
    let errors = {};

    if (!selectedDemande) {
      errors.demandes = "Ce champ est obligatoire.";
    }

    return errors;
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
        {!data ? (
          <ProgressSpinner />
        ) : (
          <>
            {" "}
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
            <h1 className="title">Demandes en Attente</h1>
            <ul className="breadcrumbs">
              <li>
                <Link to="/">Accueil</Link>
              </li>
              <li className="divider">/</li>
              <li>
                <a href="#" className="active">
                  Demandes en attente
                </a>
              </li>
            </ul>
            <Toast ref={toast} />
            <ConfirmDialog />
            <DataTable
              value={data}
              header={header}
              filters={filters}
              paginator
              rows={10}
              emptyMessage="Aucune demande trouvée."
            >
              <Column field="id" header="ID" sortable />
              <Column field="objet" header="Objet" />
              <Column field="date_demande" header="Date" sortable />
              <Column
                field="intitule"
                header="Etat"
                body={statusBodyTemplate}
              />
              <Column
                field="operations"
                header="Opérations"
                body={(rowData) => operationsBodyTemplate(rowData)}
              />
            </DataTable>
          </>
        )}
      </main>
    </div>
  );
};

export default DemandesAttente;
