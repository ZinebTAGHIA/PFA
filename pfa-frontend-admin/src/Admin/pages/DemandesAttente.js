import React, { useEffect, useRef, useState } from "react";
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
import { ProgressSpinner } from "primereact/progressspinner";
import axios from "../../api/axios";

const DemandesAttente = () => {
  const [data, setData] = useState();
  const [expandedRows, setExpandedRows] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const role = JSON.parse(localStorage.getItem("user")).role;
  const type = role === "Admin Examen" ? "examen" : "scolarité";
  const toast = useRef(null);

  useEffect(() => {
    axios
      .get(`/api/demandes/etat/en attente/type/${type}`)
      .then((response) => setData(response.data.data))
      .catch((error) => console.error(error));
  }, []);

  const allowExpansion = (rowData) => {
    return true;
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="p-3">
        <div className="grid">
          <div className="col-6">
            <Card title="Étudiant">
              <p className="m-0">Nom : {data.nom}</p>
              <p className="m-0">Prénom : {data.prenom}</p>
            </Card>
          </div>
          <div className="col-6">
            <Card title="Opérations">
              <Toast ref={toast} />
              <ConfirmDialog />
              <div className="card flex flex-wrap gap-2 justify-content-center">
                <Button
                  onClick={() => {
                    confirm1(data.user_id, data.id);
                  }}
                  icon="pi pi-times"
                  label="Refuser"
                  className="mr-2"
                  severity="danger"
                ></Button>
                <Button
                  onClick={() => {
                    confirm2(data.user_id, data.id);
                  }}
                  icon="pi pi-check"
                  label="Valider"
                ></Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const getSeverity = () => {
    return "info";
  };
  const statusBodyTemplate = (data) => {
    return <Tag value={data.intitule} severity={getSeverity()} />;
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

  const acceptFunc = (user_id, id) => {
    axios
      .put(`/api/demandes/valider/${id}`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .post(`/api/notifications`, {
        message: "Demande validée",
        user_id: user_id,
      })
      .then((response) => console.log(response.data))
      .catch((error) => console.error(error));

    axios
      .get(`/api/demandes/etat/en attente/type/${type}`)
      .then((response) => setData(response.data.data))
      .catch((error) => console.error(error));

    toast.current.show({
      severity: "info",
      summary: "Confirmé",
      detail: "Vous avez accepté",
      life: 3000,
    });
  };

  const acceptFunc2 = (user_id, id) => {
    axios
      .put(`/api/demandes/refuser/${id}`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .post(`/api/notifications`, {
        message: "Demande refusée",
        user_id: user_id,
      })
      .then((response) => console.log(response.data))
      .catch((error) => console.error(error));

    axios
      .get(`/api/demandes/etat/en attente/type/${type}`)
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

  const confirm1 = (user_id, id) => {
    confirmDialog({
      message: "Êtes-vous sûr de vouloir refuser cette demande?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => acceptFunc2(user_id, id),
      reject,
    });
  };

  const confirm2 = (user_id, id) => {
    confirmDialog({
      message: "Êtes-vous sûr de vouloir valider cette demande?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => acceptFunc(user_id, id),
      reject,
    });
  };

  return (
    <div>
      <main>
        {!data ? (
          <ProgressSpinner />
        ) : (
          <>
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
            <DataTable
              value={data}
              header={header}
              filters={filters}
              paginator
              rows={10}
              emptyMessage="Aucune demande trouvée."
              expandedRows={expandedRows}
              onRowToggle={(e) => setExpandedRows(e.data)}
              rowExpansionTemplate={rowExpansionTemplate}
            >
              <Column expander={allowExpansion} style={{ width: "5rem" }} />
              <Column field="id" header="ID" sortable />
              <Column field="objet" header="Objet" />
              <Column field="date_demande" header="Date" sortable />
              <Column
                field="intitule"
                header="Etat"
                body={statusBodyTemplate}
              />
            </DataTable>{" "}
          </>
        )}
      </main>
    </div>
  );
};

export default DemandesAttente;
