import { Page } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { TokenAccesoForm } from "../../components";

export default function ManageCode() {
  const breadcrumbs = [{ content: "", url: "/" }];

  return (
    <Page>
      <TitleBar title=" " breadcrumbs={breadcrumbs} primaryAction={null} />
      <TokenAccesoForm />
    </Page>
  );
}
