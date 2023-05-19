import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { Card } from "primereact/card";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import "../../../node_modules/primeflex/primeflex.css";
import { Link } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";

const DemandesAttente = () => {
  const [data, setData] = useState();
  const [expandedRows, setExpandedRows] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

  const toast = useRef(null);

  useEffect(() => {
    axios
      .get("/api/users/students/1")
      .then((response) => setData(response.data.data))
      .catch((error) => console.error(error));
  }, []);

  const expandAll = () => {
    let _expandedRows = {};

    data.forEach((p) => (_expandedRows[`${p.id}`] = true));

    setExpandedRows(_expandedRows);
  };

  const collapseAll = () => {
    setExpandedRows(null);
  };

  const allowExpansion = (rowData) => {
    return true;
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="p-3">
        <h5>
          <div className="grid">
            <div className="card col-6">
              <Card title="Détails">
                <p className="m-0">CIN : {data.CIN}</p>
                <p className="m-0">CNE : {data.CNE}</p>
                <p className="m-0">Email : {data.email}</p>
                <p className="m-0">Tel : {data.tel}</p>
              </Card>
            </div>
            <div className="card col-6">
              <Card title="Opérations">
                <Toast ref={toast} />
                <ConfirmDialog />
                <div className="card flex flex-wrap gap-2 justify-content-center">
                  <Button
                    onClick={() => {
                      confirm1(data.id);
                    }}
                    icon="pi pi-times"
                    label="Désactiver"
                    className="mr-2"
                    severity="danger"
                  ></Button>
                  <Button
                    onClick={() => {
                      confirm2(data.id);
                    }}
                    icon="pi pi-replay"
                    label="Réinitialiser mot de passe"
                  ></Button>
                </div>
              </Card>
            </div>
          </div>
        </h5>
      </div>
    );
  };

  const getSeverity = () => {
    return "success";
  };
  const statusBodyTemplate = (data) => {
    return <Tag value="activé" severity={getSeverity()} />;
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

  const acceptFunc1 = (id) => {
    axios
      .put(`/api/edit/users/${id}`, { is_Activated: false })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get("/api/users/students/1")
      .then((response) => setData(response.data.data))
      .catch((error) => console.error(error));

    toast.current.show({
      severity: "info",
      summary: "Confirmé",
      detail: "Vous avez accepté",
      life: 3000,
    });
  };

  const acceptFunc2 = (id) => {
    axios
      .put(`/api/reset-pass/${id}`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get("/api/users/students/1")
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
      message: "Êtes-vous sûr de vouloir désactiver ce compte?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => acceptFunc1(id),
      reject,
    });
  };

  const confirm2 = (id) => {
    confirmDialog({
      message: "Êtes-vous sûr de vouloir réinitialiser ce compte?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => acceptFunc2(id),
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
            <h1 className="title">Comptes activés</h1>
            <ul className="breadcrumbs">
              <li>
                <Link to="/">Accueil</Link>
              </li>
              <li className="divider">/</li>
              <li>
                <a href="#" className="active">
                  Comptes activés
                </a>
              </li>
            </ul>
            <DataTable
              value={data}
              header={header}
              filters={filters}
              paginator
              rows={10}
              emptyMessage="Aucun compte trouvé."
              expandedRows={expandedRows}
              onRowToggle={(e) => setExpandedRows(e.data)}
              rowExpansionTemplate={rowExpansionTemplate}
            >
              <Column expander={allowExpansion} style={{ width: "5rem" }} />
              <Column field="id" header="ID" sortable />
              <Column field="nom" header="Nom" />
              <Column field="prenom" header="Prénom" />
              <Column
                field="intitule"
                header="Etat"
                body={statusBodyTemplate}
              />
            </DataTable>
          </>
        )}
      </main>
    </div>
  );
};

export default DemandesAttente;
