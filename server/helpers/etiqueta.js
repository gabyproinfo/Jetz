import { Shopify } from "@shopify/shopify-api";
import { EtiquetaDB } from "../etiqueta-db.js";

export async function getEtiquetaOr404(req, res, checkDomain = true) {
  try {
    const response = await EtiquetaDB.read(req.params.id);
    if (
      response === undefined ||
      (checkDomain &&
        (await getShopUrlFromSession(req, res)) !== response.shopDomain)
    ) {
      res.status(404).send();
    } else {
      return response;
    }
  } catch (error) {
    res.status(500).send(error.message);
  }

  return undefined;
}

export async function getShopUrlFromSession(req, res) {
  const session = await Shopify.Utils.loadCurrentSession(req, res, true);
  return `https://${session.shop}`;
}

export async function parseEtiquetaBody(req, res) {
  return {
    shopOrder: req.body.shopOrder,
    shopOrderId: req.body.shopOrderId,
    etiquetaUrl: req.body.etiquetaUrl,
    proveedorOrdenEnvio: req.body.proveedorOrdenEnvio,
    numeroGuia: req.body.numeroGuia,
  };
}

export async function formatEtiquetaResponse(req, res, rawCodeData) {
  const formattedData = rawCodeData.map((etiqueta) => {
    const formattedEtiqueta = {
      ...etiqueta,
    };

    return formattedEtiqueta;
  });

  return formattedData;
}

export async function formatPedidosResponse(req, res, rawCodeData) {
  const formattedData = rawCodeData.map((order) => {
    const formattedOrder = {
      ...order,
    };

    return formattedOrder;
  });

  return formattedData;
}
