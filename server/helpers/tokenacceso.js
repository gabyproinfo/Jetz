import { Shopify } from "@shopify/shopify-api";

import { TokenAccesoDB } from "../tokenacceso-db.js";

export async function getTokenAccesoOr404(req, res, checkDomain = true) {
  try {
    const response = await TokenAccesoDB.read(req.params.id);
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

export async function getSession(req, res) {
  const session = await Shopify.Utils.loadCurrentSession(req, res, true);
  return session;
}

export async function parseTokenAccesoBody(req, res) {
  return {
    token: req.body.token,
    url: req.body.url,
  };
}

export async function formatTokenAccesoResponse(req, res, rawCodeData) {
  const formattedData = rawCodeData.map((tokenAcceso) => {
    const formattedQRCode = {
      ...tokenAcceso,
    };

    return formattedQRCode;
  });

  return formattedData;
}
