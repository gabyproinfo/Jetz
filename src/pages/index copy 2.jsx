import { useNavigate, TitleBar, Loading } from "@shopify/app-bridge-react";
import {
  Card,
  EmptyState,
  Layout,
  SkeletonBodyText,
  Tabs,
  Heading,
  DisplayText,
  Icon,
  MediaCard,
  CalloutCard,
  Stack,
  Badge,
} from "@shopify/polaris";
import { TokenAccesoIndex } from "../components";
import { PedidosIndex } from "../components";
import { EtiquetasIndex } from "../components";
import {
  QuestionMarkInverseMinor,
  HomeMajor,
  OrdersMinor,
  KeyMajor,
  ListMajor,
} from "@shopify/polaris-icons";
import { useAppQuery } from "../hooks";
import { useState, useCallback } from "react";

export default function HomePage() {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  /*  function linkToken(props) {
     setSelected(2);
  } */

  // const linkToken =  () => setSelected(2);

  /*
    Add an App Bridge useNavigate hook to set up the navigate function.
    This function modifies the top-level browser URL so that you can
    navigate within the embedded app and keep the browser in sync on reload.
  */
  const navigate = useNavigate();

  /* useAppQuery wraps react-query and the App Bridge authenticatedFetch function */
  const {
    data: TokenAccesos,
    isLoading2,
    isRefetching2,
  } = useAppQuery({
    url: "/api/tokenacceso",
  });

  const {
    data: Pedidos,
    isError,
    isLoading,
    isRefetching,
  } = useAppQuery({ url: "/api/pedidos" });

  const {
    data: Etiquetas,
    isLoading3,
    isRefetching3,
  } = useAppQuery({
    url: "/api/etiquetas",
  });

  const tokenAccesoMarkup = TokenAccesos?.length ? (
    <TokenAccesoIndex TokenAccesos={TokenAccesos} loading={isRefetching2} />
  ) : null;

  const PedidosMarkup = Pedidos ? (
    <PedidosIndex Pedidos={Pedidos} loading={isRefetching} />
  ) : null;

  const EtiquetasMarkup = Etiquetas ? (
    <EtiquetasIndex Etiquetas={Etiquetas} loading={isRefetching3} />
  ) : null;

  /* loadingMarkup uses the loading component from AppBridge and components from Polaris  */
  const loadingMarkup = isLoading ? (
    <Card sectioned>
      <Loading />
      <SkeletonBodyText />
    </Card>
  ) : null;

  const loadingMarkup2 = isLoading2 ? (
    <Card sectioned>
      <Loading />
      <SkeletonBodyText />
    </Card>
  ) : null;

  const loadingMarkup3 = isLoading2 ? (
    <Card sectioned>
      <Loading />
      <SkeletonBodyText />
    </Card>
  ) : null;

  const errorStateMarkup = isError ? (
    <Card sectioned>
      <Text>Error en la carga de Pedidos</Text>
    </Card>
  ) : null;

  /* Use Polaris Card and EmptyState components to define the contents of the empty state */
  const emptyStateMarkup2 =
    !isLoading && !TokenAccesos?.length ? (
      <Card sectioned>
        <EmptyState
          heading="Agrega el token de acceso"
          action={{
            content: "Agregar el token",
            onAction: () => navigate("/tokenacceso/new"),
          }}
        >
          <p>
            El token de acceso a agregar ser?? indicado en la web de www.jetz.mx
          </p>
        </EmptyState>
      </Card>
    ) : null;

  const emptyStateMarkup =
    !isLoading && !Pedidos?.length ? (
      <Card sectioned>
        <EmptyState>
          <p>{/* No hay pedidos */}</p>
        </EmptyState>
      </Card>
    ) : null;

  const emptyStateMarkup3 =
    !isLoading && !Etiquetas?.length ? (
      <Card sectioned>
        <EmptyState>
          <p></p>
        </EmptyState>
      </Card>
    ) : null;

  /*  const prueba= (<DisplayText>{'Debes crear el token de acceso. ??Como?  Presiona click en el link o dirigete a la pesta??a token de acceso.'}</DisplayText>) */
  const pageInicio = (
    <Layout>
      <Layout.Section>
        <Card title="" sectioned>
          {
            <MediaCard
              title="Bienviendo a Jetz..!!!"
              primaryAction={{
                content: "Link token de acceso",
                onAction: () => {
                  setSelected(2);
                },
              }}
              description=" Debes crear el token de acceso. ??Como?  Presiona click en el link o dirigete a la pesta??a token de acceso."
              /* "Te prestamos el mejor de los servicios.
              Trabajamos con las mejores agencias de transporte, muchas de ellas especializadas en paqueter??a internacional. Siempre encontrar??s un transportista que se adapte a tus necesidades.
  
              ??C??mo funciona?
              
              1. Registrate gratis y pag?? solo por los env??os que realices.
              2. Cotiz?? sin costo tus env??os y seleccion?? la mejor opci??n.
              3. Prepar?? tus env??os y despachalos r??pidamente." */
              //popoverActions={[{ content: "Dismiss", onAction: () => {} }]}
            >
              <img
                alt=""
                width="100%"
                height="100%"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                src="https://jetz.mx/images/assets/2021/logo_simple.svg"
              />
              {/*   <p> 1. Registrate gratis y pag?? solo por los env??os que realices.</p>
              <p>2. Cotiz?? sin costo tus env??os y seleccion?? la mejor opci??n.</p>
              <p> 3. Prepar?? tus env??os y despachalos r??pidamente.</p> */}
            </MediaCard>
          }

          <CalloutCard
            title="Enviar ahora"
            //illustration="https://cdn.pixabay.com/photo/2013/03/29/13/39/e-mail-97624_1280.png?width=1850"
            //illustration="https://consumer-tkbdownload.huawei.com/ctkbfm/applet/simulator/es-es15758596/photo1.png?width=1850"
            illustration="https://puertosylogistica.com/wp-content/uploads/2017/08/paqueteria.jpg?width=2850"
            primaryAction={{
              content: "Envia ahora, con el mejor servicio. ",
              url: "https://jetz.mx/",
            }}
          >
            <p>
              Te ofrecemos una gesti??n de tus env??os en la que sin duda
              ahorrares tiempo, no te vas a arrpentir.
            </p>
          </CalloutCard>

          <CalloutCard
            title="Presupuesto de env??o"
            // illustration="https://cdn.pixabay.com/photo/2013/03/29/13/39/e-mail-97624_1280.png?width=1850"
            illustration="https://c5d9896c-a-62cb3a1a-s-sites.googlegroups.com/site/itmcostos/home/costos.png?attachauth=ANoY7coeO-Vs5vtCTDJa1MNRi_oJlMo4C3yL8HLxKfFWDVu2tBoMFtrI6HXeBB7cp2LbhME6Y6N8KfywwPjbab0Q7F7Q5cXy0QIj_vRYqQd5TcYhgk3yiX3sukIDrybrBc664uAtkERQkdM03LvAvHnjR_9QblNIYtGHemsUG7Fhq-M92u3yChHWoTMHLGBn0bDXyEJPbWfm5259BtHi2Nax2CbH-0zhKQ%3D%3D&attredirects=0"
            primaryAction={{
              content: "Obten el mejor presupuesto.",
              url: "https://jetz.mx/",
            }}
          >
            <p>
              Env??a tu paqueter??a indiferentemente del tama??o, podemos ofrecerle
              una cotizaci??n inmediata y acorde a sus necesidades. Complete los
              detalles de su env??o y obtendr?? las mejores precios del mercado.
              Si est?? de acuerdo, realice su reserva.
            </p>
          </CalloutCard>

          <CalloutCard
            title="Seguridad y confianza"
            //illustration="https://cdn.pixabay.com/photo/2013/03/29/13/39/e-mail-97624_1280.png?width=1850"
            illustration="https://cdn1.infocasas.com.uy/web/582df39c1fec2_infocdn__seguro-confiable.png"
            primaryAction={{
              content: "Envio seguro y confiable.",
              url: "https://jetz.mx/",
            }}
          >
            <p>
              Cuando la confianza es alta, la comunicaci??n es f??cil, instant??nea
              y efectiva..
            </p>
          </CalloutCard>

          {/*   {      <Stack>
                <Badge>Envia ahora, con el mejor servicio</Badge>
                <Badge>Obten el mejor presupuesto</Badge>
                <Badge>Envio seguro y confiable</Badge>
             </Stack> } */}
        </Card>

        <p>
          <br></br>
        </p>
      </Layout.Section>
    </Layout>
  );

  const pageAyuda = (
    <Layout>
      <Layout.Section>
        <Card title="">
          <DisplayText size="medium" spacing="tight">
            <p>??Necesitas Ayuda?</p>
          </DisplayText>
          <CalloutCard
            title="??C??mo funciona?"
            illustration="https://www.pngmart.com/files/11/Interrogation-PNG-Transparent-Image.png"
            primaryAction={{
              content: "Crea tu cuenta ",
              url: "https://jetz.mx/",
            }}
          >
            <p>1. Crea tu token. </p>
            <p>2. Acredita cr??dito a tu cuenta. </p>
            <p>
              3. Ingresa los datos de tu env??o y selecciona la mejor opci??n.{" "}
            </p>
            <p>
              4. Escoge el tipo de env??o. Prepara tus env??os y despachalos
              r??pidamente.
            </p>

            {/*               <p>2. Cotiza sin costo tus env??os y selecciona la mejor opci??n.</p>
                <p>3. Paga solo por los env??os que realices.</p>
                <p>4. Prepara tus env??os y despachalos r??pidamente.</p> */}
          </CalloutCard>
        </Card>

        <Card title="">
          <CalloutCard
            title="Contactanos!!"
            illustration="https://cdn-icons-png.flaticon.com/512/39/39995.png"
            primaryAction={{
              content: "Click aqu??.",
              url: "https://jetz.mx/contacto",
            }}
          >
            <p>
              {" "}
              Puedes comunicarte con nosotros a trav??s de la p??gina web, de
              nuestro link.
            </p>
          </CalloutCard>
        </Card>

        <Card title="">
          <DisplayText size="small" spacing="tight">
            <p></p>
          </DisplayText>
          <CalloutCard
            title="Carrier con lo que Trabajamos!!"
            illustration="https://firmar.online/wp-content/uploads/2021/11/firmar-online-log1.png"
            primaryAction={{
              content: "https://jetz.mx/",
              url: "https://jetz.mx/",
            }}
          >
            {
              <Stack>
                <Badge>Fedex Economico</Badge>
                <Badge>Fedex Express</Badge>
                <Badge>Estafeta economico</Badge>
                <Badge>Estafeta Express</Badge>
                <Badge>DHL economico</Badge>
                <Badge>DHL Express</Badge>
                <Badge>Redpack Economico</Badge>
                <Badge>Redpack Express</Badge>
                <Badge>99 Minutos economico</Badge>
                <Badge>99 Minutos express</Badge>
                <Badge>UPS Express</Badge>
                <Badge>UPS Economico</Badge>
              </Stack>
            }
          </CalloutCard>
        </Card>
      </Layout.Section>
    </Layout>
  );

  const pageToken = (
    <Layout>
      <Layout.Section>
        <DisplayText size="small" spacing="tight">
          Token de Acceso a Aplicaci??n
        </DisplayText>
        <p>
          <br></br>
        </p>
        {loadingMarkup2}
        {tokenAccesoMarkup}
        {emptyStateMarkup2}
      </Layout.Section>
    </Layout>
  );

  const pagePedidos = (
    <Layout>
      <Layout.Section>
        <DisplayText size="small" spacing="tight">
          Lista de pedidos seleccionados con los transportistas de la aplicaci??n
        </DisplayText>
        <p>
          <br></br>
        </p>

        {loadingMarkup}
        {PedidosMarkup}
        {emptyStateMarkup}
        {errorStateMarkup}
      </Layout.Section>
    </Layout>
  );

  const pageEtiquetas = (
    <Layout>
      <Layout.Section>
        <DisplayText size="small" spacing="tight">
          Lista de etiquetas generadas
        </DisplayText>
        <p>
          <br></br>
        </p>

        {loadingMarkup3}
        {EtiquetasMarkup}
        {emptyStateMarkup3}
      </Layout.Section>
    </Layout>
  );

  const tituloPedidos = (
    <Heading size="large" spacing="tight">
      <Icon source={OrdersMinor} color="base" />
      Pedidos
    </Heading>
  );

  const tituloToken = (
    <Heading size="large" spacing="tight">
      <Icon source={KeyMajor} color="base" />
      Token de Acceso
    </Heading>
  );

  const tituloEtiquetas = (
    <Heading size="large" spacing="tight">
      <Icon source={ListMajor} color="base" />
      Etiquetas Generadas
    </Heading>
  );

  const tituloInicio = (
    <Heading size="large" spacing="tight">
      <Icon source={HomeMajor} color="base" />
      Inicio
    </Heading>
  );

  const tituloAyuda = (
    <Heading size="large" spacing="tight">
      <Icon source={QuestionMarkInverseMinor} color="base" />
      Ayuda
    </Heading>
  );

  const tabs = [
    {
      id: "pageInicio",
      content: tituloInicio,
      page: pageInicio,
    },
    {
      id: "pagePedidos",
      content: tituloPedidos,
      page: pagePedidos,
    },
    {
      id: "pageToken",
      content: tituloToken,
      page: pageToken,
    },
    {
      id: "pageEtiquetas",
      content: tituloEtiquetas,
      page: pageEtiquetas,
    },
    {
      id: "pageAyuda",
      content: tituloAyuda,
      page: pageAyuda,
    },
  ];
  return (
    <Card>
      <Tabs
        tabs={tabs}
        size="large"
        selected={selected}
        onSelect={handleTabChange}
      >
        <Card.Section style={{ fontSize: 20 }}>
          {tabs[selected].page}
        </Card.Section>
      </Tabs>
    </Card>
  );
}
