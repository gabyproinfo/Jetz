import { Card, Page, Layout, SkeletonBodyText } from "@shopify/polaris";
import { Loading, TitleBar } from "@shopify/app-bridge-react";
import { TokenAccesoForm } from "../../components";
import { useParams } from "react-router-dom";
import { useAppQuery } from "../../hooks";

export default function TokenAccesoEdit() {
  const breadcrumbs = [{ content: "Inicio", url: "/" }];

  const { id } = useParams();
  const {
    data: TokenAcceso,
    isLoading,
    isRefetching,
  } = useAppQuery({
    url: `/api/tokenacceso/${id}`,
    reactQueryOptions: {
      refetchOnReconnect: false,
    },
  });

  /* Loading action and markup that uses App Bridge and Polaris components */
  if (isLoading || isRefetching) {
    return (
      <Page>
        <TitleBar breadcrumbs={breadcrumbs} primaryAction={null} />
        <Loading />
        <Layout>
          <Layout.Section>
            <Card sectioned>
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
      <TitleBar title=" " breadcrumbs={breadcrumbs} primaryAction={null} />
      <TokenAccesoForm TokenAcceso={TokenAcceso} />
    </Page>
  );
}
