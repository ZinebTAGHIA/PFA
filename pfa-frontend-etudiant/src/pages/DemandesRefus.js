import React, { useEffect, useState } from "react";
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
import { ProgressSpinner } from "primereact/progressspinner";

const DemandesRefus = ({ user }) => {
  const [data, setData] = useState();
  const [expandedRows, setExpandedRows] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

  useEffect(() => {
    axios
      .get(`/api/demandes/etat/refusée/student/${user.id}`)
      .then((response) => setData(response.data.data))
      .catch((error) => console.error(error));
  }, []);

  const allowExpansion = (rowData) => {
    return true;
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="p-3">
        <h5>
          Demande de la part de {data.nom} {data.prenom}
        </h5>
      </div>
    );
  };

  const getSeverity = () => {
    return "danger";
  };
  const statusBodyTemplate = (data) => {
    return <Tag value="refusée" severity={getSeverity()} />;
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

  return (
    <div>
      <main>
        {!data ? (
          <ProgressSpinner />
        ) : (
          <>
            <h1 className="title">Demandes refusées</h1>
            <ul className="breadcrumbs">
              <li>
                <Link to="/">Accueil</Link>
              </li>
              <li className="divider">/</li>
              <li>
                <a href="#" className="active">
                  Demandes refusées
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
              {/* <Column expander={allowExpansion} style={{ width: "5rem" }} /> */}
              <Column field="id" header="ID" sortable />
              <Column field="objet" header="Objet" />
              <Column field="date_demande" header="Date" sortable />
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

export default DemandesRefus;
