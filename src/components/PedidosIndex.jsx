import { useNavigate } from "@shopify/app-bridge-react";
import {
  Card,
  IndexTable,
  UnstyledLink,
  useIndexResourceState,
  Frame,
  Loading,
  DisplayText,
  Subheading,
  Spinner,
  Banner,
  Link,
  Filters,
  TextField,
  TextStyle,
  Select,
} from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { useAuthenticatedFetch } from "../hooks";

import dayjs from "dayjs";

export function PedidosIndex({ Pedidos, loading }) {
  //console.log(9);
  //console.log(Pedidos);
  //console.log(8);

  const fetch = useAuthenticatedFetch();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [urlEtiqueta, setUrlEtiqueta] = useState(null);
  const [urlEtiquetaTexto, setUrlEtiquetaTexto] = useState(null);
  const [errorTexto, setErrorTexto] = useState(null);
  const [cantidadSeleccion, setCantidadSeleccion] = useState(0);

  // se trabaja en la misma pantalla
  const [urlRecoleccionTexto, setUrlRecoleccionTexto] = useState(null);

  const resourceName = {
    singular: "Pedido",
    plural: "Pedidos",
  };

  const limpiarValores = () => {
    setUrlEtiqueta(null);
    setUrlEtiquetaTexto(null);
    setUrlRecoleccionTexto(null);

    setErrorTexto(null);
  };

  const generarEtiqueta = useCallback(async (valor, cantidadSeleccionGet) => {
    if (cantidadSeleccionGet > 1) {
      setErrorTexto(
        <Banner
          title="Nota: Solo puede seleccionar uno de los pedidos para las acciones"
          status="warning"
          onDismiss={limpiarValores}
        />
      );
    } else {
      limpiarValores();

      // Se coloca que se muestre el loaading al momento de comenzar
      setLoading(
        <Frame>
          <Loading /> <Spinner size="large" />
          <Subheading>Procesando por favor espere...</Subheading>
        </Frame>
      );

      // Se llama al endpoint de generacion de etiqueta, al endpoint interno del backend
      const response = await fetch(`/api/generaretiqueta/` + valor, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      // Se espera la respuesta por parte del fecha
      const Respuesta = await response.json();

      // Se quita el loading porque ya termino de cargar
      setLoading(false);

      if (Respuesta.code != 200) {
        setErrorTexto(
          <Banner
            title={
              Respuesta?.mensaje
                ? Respuesta?.mensaje
                : "Error generando la etiqueta, refresque e intente nuevamente"
            }
            status="warning"
            onDismiss={limpiarValores}
          />
        );
      } else {
        // Se setea la etiqueta al State de Etiqueta
        setUrlEtiqueta(Respuesta.data.etiqueta);
        setUrlEtiquetaTexto("Generación de etiqueta Correcta");
      }

      // Se abre la respuesta con el pdf en una ventana nueva
      //window.open(Respuesta.data.etiqueta);
    }
  }, []);

  const generarRecoleccion = useCallback(
    async (valor, cantidadSeleccionGet) => {
      if (cantidadSeleccionGet > 1) {
        setErrorTexto(
          <Banner
            title="Nota: Solo puede seleccionar uno de los pedidos para las acciones"
            status="warning"
            onDismiss={limpiarValores}
          />
        );
      } else {
        limpiarValores();

        // Se coloca que se muestre el loaading al momento de comenzar
        setLoading(
          <Frame>
            <Loading /> <Spinner size="large" />
            <Subheading>Procesando por favor espere...</Subheading>
          </Frame>
        );

        // Se llama al endpoint de generacion de etiqueta, al endpoint interno del backend
        const response = await fetch(`/api/generarrecoleccion/` + valor, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        // Se espera la respuesta por parte del fecha
        const respuesta = await response.json();
        //console.log(respuesta.data.error);

        if (respuesta.data.error != "") {
          setErrorTexto(
            <Banner
              title={
                respuesta?.data?.error
                  ? respuesta?.data?.error
                  : "Error generando la recolección, refresque e intente nuevamente"
              }
              status="warning"
              onDismiss={limpiarValores}
            />
          );
        } else {
          setUrlRecoleccionTexto("Generación de Recolección Correcta");
        }
        //console.log(respuesta);

        // Se quita el loading porque ya termino de cargar
        setLoading(false);

        // Se setea la etiqueta al State de Etiqueta
        //setUrlRecoleccion(Respuesta.etiqueta);
      }
    },
    []
  );

  const mostrarRastreo = useCallback(async (valor, cantidadSeleccionGet) => {
    if (cantidadSeleccionGet > 1) {
      setErrorTexto(
        <Banner
          title="Nota: Solo puede seleccionar uno de los pedidos para las acciones"
          status="warning"
          onDismiss={limpiarValores}
        />
      );
    } else {
      navigate("/rastreo/" + valor);
    }
  }, []);

  const reimpresionEtiqueta = useCallback(
    async (valor, cantidadSeleccionGet) => {
      if (cantidadSeleccionGet > 1) {
        setErrorTexto(
          <Banner
            title="Nota: Solo puede seleccionar uno de los pedidos para las acciones"
            status="warning"
            onDismiss={limpiarValores}
          />
        );
      } else {
        // Se coloca que se muestre el loaading al momento de comenzar
        setLoading(
          <Frame>
            <Loading /> <Spinner size="large" />
            <Subheading>Procesando por favor espere...</Subheading>
          </Frame>
        );

        // Se llama al endpoint de reimpresion de etiqueta, al endpoint interno del backend
        const response = await fetch(`/api/reimpresionetiqueta/` + valor, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        // Se espera la respuesta por parte del fecha, se transforman en json
        const Respuesta = await response.json();

        // Se quita el loading porque ya termino de cargar
        setLoading(false);

        // Se setea la etiqueta al State de Etiqueta
        setUrlEtiqueta(Respuesta.data.etiqueta);
        setUrlEtiquetaTexto("Reimpresión de Etiqueta Correcta");

        // Se abre la respuesta con el pdf en una ventana nueva
        //window.open(Respuesta.etiqueta);
      }
    },
    []
  );

  // Selecciona cuando se le da en el checkbox
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(Pedidos);

  useEffect(() => {
    setCantidadSeleccion(selectedResources.length);
    //console.log("total:"+selectedResources.length);
    //console.log("cantidadSeleccion:"+cantidadSeleccion);
    if (selectedResources.length > 1) {
      //console.log(9);
      setErrorTexto(
        <Banner
          title="Nota: Solo puede seleccionar uno de los pedidos para las acciones"
          status="warning"
          onDismiss={limpiarValores}
        />
      );
    } else {
      //console.log(8);
      setErrorTexto(null);
    }
  }, [selectedResources]);

  // Acciones que se muestran al dar click
  const promotedBulkActions = [
    {
      content: "Generar Etiqueta",
      onAction: () => generarEtiqueta(selectedResources, cantidadSeleccion),
    },
    {
      content: "Recolección",
      onAction: () => generarRecoleccion(selectedResources, cantidadSeleccion),
    },
    {
      content: "Rastrear",
      onAction: () => mostrarRastreo(selectedResources, cantidadSeleccion),
    },
    {
      content: "Reimpresión de etiqueta",
      onAction: () => reimpresionEtiqueta(selectedResources, cantidadSeleccion),
    },
  ];

  // Lista de Pedidos
  const rowMarkupTabla =
    Pedidos.length > 0
      ? Pedidos.map(
          (
            {
              id,
              name,
              customer,
              created_at,
              shipping_lines,
              error,
              mensaje,
              total_price,
              currency,
            },
            index
          ) => (
            <IndexTable.Row
              id={id}
              key={id}
              selected={selectedResources.includes(id)}
              position={index}
            >
              <IndexTable.Cell>{name}</IndexTable.Cell>
              <IndexTable.Cell>
                {customer?.first_name} {customer?.last_name}
              </IndexTable.Cell>
              <IndexTable.Cell>
                {shipping_lines[0]?.source} {shipping_lines[0]?.title}
              </IndexTable.Cell>
              <IndexTable.Cell>
                {total_price} {currency}
              </IndexTable.Cell>
              <IndexTable.Cell>
                {dayjs(created_at).format("DD/MM/YYYY HH:mm:ss")}
              </IndexTable.Cell>
            </IndexTable.Row>
          )
        )
      : null;

  const tabla = rowMarkupTabla ? (
    <IndexTable
      resourceName={resourceName}
      itemCount={Pedidos.length}
      selectedItemsCount={
        allResourcesSelected ? "All" : selectedResources.length
      }
      onSelectionChange={handleSelectionChange}
      promotedBulkActions={promotedBulkActions}
      headings={[
        { title: "Pedido" },
        { title: "Cliente" },
        { title: "Proveedor de Envío" },
        { title: "Monto" },
        { title: "Fecha Pedido" },
      ]}
    >
      {rowMarkupTabla}
    </IndexTable>
  ) : Pedidos.length === 0 ? (
    <DisplayText size="small" spacing="tight">
      No hay pedidos
    </DisplayText>
  ) : null;

  const urlEtiquetaConst = urlEtiquetaTexto ? (
    <Banner
      title={urlEtiquetaTexto}
      status="success"
      action={{ content: "Ver Etiqueta", url: urlEtiqueta }}
      onDismiss={limpiarValores}
    />
  ) : null;

  const urlRecoleccionConst = urlRecoleccionTexto ? (
    <Banner
      title={urlRecoleccionTexto}
      status="success"
      onDismiss={limpiarValores}
    />
  ) : null;

  return (
    <Card>
      {isLoading}
      {errorTexto}

      {urlEtiquetaConst}
      {urlRecoleccionConst}
      {tabla}
    </Card>
  );
}
