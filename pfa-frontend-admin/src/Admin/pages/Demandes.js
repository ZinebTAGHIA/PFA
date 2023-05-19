import React, { useEffect, useState } from "react";
import axios from "axios";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";

const DemandesAttente = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/demandes")
      .then((response) => setData(response.data.data))
      .catch((error) => console.error(error));
  }, []);

  const getSeverity = (status) => {
    switch (status) {
      case "en attente":
        return "info";

      case "validée":
        return "success";

      case "refusée":
        return "danger";
    }
  };
  const statusBodyTemplate = (data) => {
    return <Tag value={data.intitule} severity={getSeverity(data.intitule)} />;
  };
  return (
    <div>
      <main>
        <h1>Demandes en Attente</h1>
        <DataTable
          value={data}
          paginator
          rows={10}
          emptyMessage="Aucune demande trouvée."
        >
          <Column field="id" header="ID" sortable filter />
          <Column field="objet" header="Objet" filter />
          <Column field="date_demande" header="Date" sortable filter />
          <Column
            field="intitule"
            header="Etat"
            body={statusBodyTemplate}
            filter
          />
        </DataTable>
      </main>
    </div>
  );
};

export default DemandesAttente;
