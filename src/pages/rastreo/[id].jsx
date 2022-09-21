import { Card, Page, Layout, SkeletonBodyText } from "@shopify/polaris";
import { Loading, TitleBar } from "@shopify/app-bridge-react";
import { RastreoIndex } from "../../components";
import { useParams } from "react-router-dom";
import { useAppQuery } from "../../hooks";

export default function RastreoId() {
  const breadcrumbs = [{ content: "Inicio", url: "/" }];

  const { id } = useParams();
  const {
    data: Rastreo,
    isLoading,
    isRefetching,
  } = useAppQuery({
    url: `/api/rastreo/${id}`,
    reactQueryOptions: {
      refetchOnReconnect: false,
    },
  });

  /* Loading action and markup that uses App Bridge and Polaris components */
  if (isLoading || isRefetching) {
    return (
      <Page>
        <TitleBar
          title="Rastreo del Pedido"
          breadcrumbs={breadcrumbs}
          primaryAction={null}
        />
        <Loading />
        <Layout>
          <Layout.Section>
            <Card sectioned title="Rastreo">
              <SkeletonBodyText />
            </Card>
          </Layout.Section>
          <Layout.Section secondary></Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page>
      <TitleBar
        title="Rastreo del Pedido"
        breadcrumbs={breadcrumbs}
        primaryAction={null}
      />
      <RastreoIndex Rastreos={Rastreo} />
    </Page>
  );
}
