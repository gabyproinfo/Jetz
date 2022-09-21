import { Card } from "@shopify/polaris";

export function RastreoIndex({ Rastreos, loading }) {
  const carrier = Rastreos.data.carrier
    ? Rastreos.data.carrier
    : "(Sin información)";
  const carrier_title = Rastreos.data.carrier_title
    ? Rastreos.data.carrier_title
    : "(Sin información)";
  const tracking = Rastreos.data.tracking
    ? Rastreos.data.tracking
    : "(Sin información)";
  const shippeddate = Rastreos.data.shippeddate
    ? Rastreos.data.shippeddate
    : "(Sin información)";
  const deliverydate = Rastreos.data.deliverydate
    ? Rastreos.data.deliverydate
    : "(Sin información)";
  const deliverytime = Rastreos.data.deliverytime
    ? Rastreos.data.deliverytime
    : "(Sin información)";
  const deliverylocation = Rastreos.data.deliverylocation
    ? Rastreos.data.deliverylocation
    : "(Sin información)";
  const weight = Rastreos.data.weight
    ? Rastreos.data.weight
    : "(Sin información)";

  /* A layout for small screens, built using Polaris components */
  return (
    <Card title="Rastreo del Pedido">
      <Card.Section title="Proveedor:">
        <p>{carrier}</p>
      </Card.Section>

      <Card.Section title="Descripción:">
        <p>{carrier_title}</p>
      </Card.Section>

      <Card.Section title="Tracking:">
        <p>{tracking}</p>
      </Card.Section>

      <Card.Section title="Salida de Paquete:">
        <p>{shippeddate}</p>
      </Card.Section>

      <Card.Section title="Fecha Entregado Paquete:">
        <p>{deliverydate}</p>
      </Card.Section>

      <Card.Section title="Hora de Entregado:">
        <p>{deliverytime}</p>
      </Card.Section>

      <Card.Section title="Ubicación de Entregado:">
        <p>{deliverylocation}</p>
      </Card.Section>
    </Card>
  );
}

/* A function to truncate long strings */
function truncate(str, n) {
  return str.length > n ? str.substr(0, n - 1) + "…" : str;
}
