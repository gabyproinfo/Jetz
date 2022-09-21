import { Card, IndexTable, UnstyledLink } from "@shopify/polaris";

// Para el formato de fecha
import dayjs from "dayjs";

export function EtiquetasIndex({ Etiquetas, loading }) {
  const resourceName = {
    singular: "Etiqueta",
    plural: "Etiquetas",
  };

  const rowMarkup = Etiquetas.map(
    (
      {
        id,
        shopOrder,
        etiquetaUrl,
        proveedorOrdenEnvio,
        numeroGuia,
        createdAt,
      },
      index
    ) => {
      return (
        <IndexTable.Row id={id} key={id} position={index}>
          <IndexTable.Cell>
            <UnstyledLink>{shopOrder}</UnstyledLink>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <UnstyledLink>{numeroGuia}</UnstyledLink>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <UnstyledLink>{proveedorOrdenEnvio}</UnstyledLink>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <UnstyledLink data-primary-link url={`${etiquetaUrl}`} external>
              {etiquetaUrl}
            </UnstyledLink>
          </IndexTable.Cell>
          <IndexTable.Cell>
            {dayjs(createdAt).format("DD/MM/YYYY HH:mm:ss")}
          </IndexTable.Cell>
        </IndexTable.Row>
      );
    }
  );

  return (
    <Card>
      <IndexTable
        resourceName={resourceName}
        itemCount={Etiquetas.length}
        headings={[
          { title: "Pedido" },
          { title: "Número de Guía" },
          { title: "Id de Envío" },
          { title: "Url de Etiqueta" },
          { title: "Fecha Registro" },
        ]}
        selectable={false}
        loading={loading}
      >
        {rowMarkup}
      </IndexTable>
    </Card>
  );
}
