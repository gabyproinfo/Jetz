import { useState, useCallback } from "react";
import {
  Card,
  Form,
  FormLayout,
  TextField,
  Button,
  Stack,
  Layout,
} from "@shopify/polaris";
import {
  ContextualSaveBar,
  useAppBridge,
  useNavigate,
} from "@shopify/app-bridge-react";

/* Import the useAuthenticatedFetch hook included in the Node app template */
import { useAuthenticatedFetch, useShopifyQuery } from "../hooks";

/* Import custom hooks for forms */
import { useForm, useField, notEmptyString } from "@shopify/react-form";

export function TokenAccesoForm({ TokenAcceso: InitialTokenAcceso }) {
  const [TokenAcceso, setTokenAcceso] = useState(InitialTokenAcceso);
  const navigate = useNavigate();
  const appBridge = useAppBridge();
  const fetch = useAuthenticatedFetch();

  const onSubmit = useCallback(
    (body) => {
      (async () => {
        const parsedBody = body;
        //parsedBody.destination = parsedBody.destination[0];
        const TokenAccesoId = TokenAcceso?.id;

        const token2 = parsedBody.token;
        const url2 = parsedBody.url;
        // construct the appropriate URL to send the API request to based on whether the QR code is new or being updated
        const url = TokenAccesoId
          ? `/api/tokenacceso/${TokenAccesoId}`
          : "/api/tokenaccesoguardar/" + token2 + "/" + url2;
        // a condition to select the appropriate HTTP method: PATCH to update a QR code or POST to create a new QR code
        const method = TokenAccesoId ? "PATCH" : "GET";
        const valores = JSON.stringify(parsedBody);

        // use (authenticated) fetch from App Bridge to send the request to the API and, if successful, clear the form to reset the ContextualSaveBar and parse the response JSON
        const response = await fetch(url, {
          method, //,

          //body: JSON.stringify(parsedBody),
          //headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          makeClean();
          const TokenAcceso = await response.json();

          navigate(`/`);
          /*
          // if this is a new QR code, then save the QR code and navigate to the edit page; this behavior is the standard when saving resources in the Shopify admin 
          if (!TokenAccesoId) {
            navigate(`/tokenacceso/${TokenAcceso.id}`);
            //navigate(`/tokenacceso`);
            //
             
          } else {
            setTokenAcceso(TokenAcceso);
          }
          */
        }
      })();
      return { status: "success" };
    },
    [TokenAcceso, setTokenAcceso]
  );

  /*
    Sets up the form state with the useForm hook.

    Accepts a "fields" object that sets up each individual field with a default value and validation rules.

    Returns a "fields" object that is destructured to access each of the fields individually, so they can be used in other parts of the component.

    Returns helpers to manage form state, as well as component state that is based on form state.
  */
  const {
    fields: { token, url },
    dirty,
    reset,
    submitting,
    submit,
    makeClean,
  } = useForm({
    fields: {
      token: useField({
        value: TokenAcceso?.token || "",
        validates: [
          notEmptyString("Por favor coloque el codigo de token provisto"),
        ],
      }),
      url: useField({
        value: TokenAcceso?.url || "",
        validates: [notEmptyString("Por favor coloque la url")],
      }),
    },
    onSubmit,
  });

  const [isDeleting, setIsDeleting] = useState(false);
  const deleteTokenAcceso = useCallback(async () => {
    reset();
    /* The isDeleting state disables the download button and the delete QR code button to show the merchant that an action is in progress */
    setIsDeleting(true);
    const response = await fetch(`/api/tokenacceso/${TokenAcceso.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      navigate(`/`);
    }
  }, [TokenAcceso]);

  /* The form layout, created using Polaris and App Bridge components. */
  return (
    <Stack vertical>
      <Layout>
        <Layout.Section>
          <Form>
            <ContextualSaveBar
              saveAction={{
                label: "Save",
                onAction: submit,
                loading: submitting,
                disabled: submitting,
              }}
              discardAction={{
                label: "Discard",
                onAction: reset,
                loading: submitting,
                disabled: submitting,
              }}
              visible={dirty}
              fullWidth
            />
            <FormLayout>
              <Card sectioned title="Token de Acceso">
                <TextField
                  {...token}
                  label="Token de Acceso"
                  labelHidden
                  helpText="Crea tu token de acceso en nuestra web www.jetz.mx"
                />
                <TextField
                  {...url}
                  label="URL de Acceso"
                  labelHidden
                  helpText="URL de Acceso sin colocar el https"
                />
              </Card>
            </FormLayout>
          </Form>
        </Layout.Section>
        <Layout.Section secondary></Layout.Section>
        <Layout.Section>
          {TokenAcceso?.id && (
            <Button
              outline
              destructive
              onClick={deleteTokenAcceso}
              loading={isDeleting}
            >
              Eliminar Token
            </Button>
          )}
        </Layout.Section>
      </Layout>
    </Stack>
  );
}
