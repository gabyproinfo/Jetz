import { useNavigate } from "@shopify/app-bridge-react";
import { Card, IndexTable, UnstyledLink } from "@shopify/polaris";

/* useMedia is used to support multiple screen sizes */
import { useMedia } from "@shopify/react-hooks";

/* dayjs is used to capture and format the date a QR code was created or modified */
import dayjs from "dayjs";

export function TokenAccesoIndex({ TokenAccesos, loading }) {
  const navigate = useNavigate();

  /* Check if screen is small */
  const isSmallScreen = useMedia("(max-width: 640px)");

  const resourceName = {
    singular: "Token Acceso",
    plural: "Token Accesos",
  };

  const rowMarkup = TokenAccesos.map(({ id, token, url, createdAt }, index) => {
    /* The form layout, created using Polaris components. Includes the QR code data set above. */
    return (
      <IndexTable.Row
        id={id}
        key={id}
        position={index}
        onClick={() => {
          navigate(`/tokenacceso/${id}`);
        }}
      >
        <IndexTable.Cell>
          <UnstyledLink data-primary-link url={`/tokenacceso/${id}`}>
            {token}
          </UnstyledLink>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <UnstyledLink data-primary-link url={`/tokenacceso/${id}`}>
            {url}
          </UnstyledLink>
        </IndexTable.Cell>
        <IndexTable.Cell>
          {dayjs(createdAt).format("DD/MM/YYYY HH:mm:ss")}
        </IndexTable.Cell>
        <IndexTable.Cell></IndexTable.Cell>
      </IndexTable.Row>
    );
  });

  return (
    <Card>
      <IndexTable
        resourceName={resourceName}
        itemCount={TokenAccesos.length}
        headings={[
          { title: "Token" },
          { title: "Url" },
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

/* A function to truncate long strings */
function truncate(str, n) {
  return str.length > n ? str.substr(0, n - 1) + "…" : str;
}
