import { TokenAccesoDB } from "../tokenacceso-db.js";
import { EtiquetaDB } from "../etiqueta-db.js";
import {
  getTokenAccesoOr404,
  getShopUrlFromSession,
  getSession,
  parseTokenAccesoBody,
  formatTokenAccesoResponse,
} from "../helpers/tokenacceso.js";

import {
  getEtiquetaOr404,
  parseEtiquetaBody,
  formatEtiquetaResponse,
  formatPedidosResponse,
} from "../helpers/etiqueta.js";

import axios from "axios";
import { CarrierService } from "@shopify/shopify-api/dist/rest-resources/2022-07/index.js";
import { Order } from "@shopify/shopify-api/dist/rest-resources/2022-07/index.js";
import { raw } from "express";

export default function applyTokenAccesoApiEndpoints(app) {
  // Guardar Token

  app.get("/api/tokenaccesoguardar/:token2/:url2", async (req, res) => {
    try {
      //console.log(9);
      let token2 = req.params.token2;
      let url2 = req.params.url2;

      //console.log(req.params)
      //console.log(req.params.token2)
      //console.log(req.params.url2)
      const shopUrl = await getShopUrlFromSession(req, res);

      const idTokenAccesoDB = await TokenAccesoDB.create({
        token: token2,
        url: url2,
        shopDomain: shopUrl,
      });

      const response = await formatTokenAccesoResponse(req, res, [
        await TokenAccesoDB.read(idTokenAccesoDB),
      ]);

      /*     
      const id = await TokenAccesoDB.create({
        ...(await parseTokenAccesoBody(req)),
        shopDomain: await getShopUrlFromSession(req, res),
      });
      const response = await formatTokenAccesoResponse(req, res, [
        await TokenAccesoDB.read(id),
      ]); 
  */
      res.status(201).send(response[0]);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.post("/api/tokenacceso", async (req, res) => {
    try {
      //console.log(12);
      //console.log(req.params);
      const id = await TokenAccesoDB.create({
        ...(await parseTokenAccesoBody(req)),
        shopDomain: await getShopUrlFromSession(req, res),
      });
      const response = await formatTokenAccesoResponse(req, res, [
        await TokenAccesoDB.read(id),
      ]);
      res.status(201).send(response[0]);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  // Modificar Token
  app.patch("/api/tokenacceso/:id", async (req, res) => {
    const tokenacceso = await getTokenAccesoOr404(req, res);

    if (tokenacceso) {
      try {
        await TokenAccesoDB.update(
          req.params.id,
          await parseTokenAccesoBody(req)
        );
        const response = await formatTokenAccesoResponse(req, res, [
          await TokenAccesoDB.read(req.params.id),
        ]);
        res.status(200).send(response[0]);
      } catch (error) {
        res.status(500).send(error.message);
      }
    }
  });

  // Listar Token
  app.get("/api/tokenacceso", async (req, res) => {
    try {
      const rawCodeData = await TokenAccesoDB.list(
        await getShopUrlFromSession(req, res)
      );

      const response = await formatTokenAccesoResponse(req, res, rawCodeData);
      res.status(200).send(response);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.get("/api/carrier", async (req, res) => {
    try {
      const session = await getSession(req, res);

      const rawCodeData = await CarrierService.all({
        session: session,
      });

      //console.log(rawCodeData);

      if (rawCodeData.length < 1) {
        /*       const rawCodeData2 = await CarrierService.delete({
          session: session,
          id: 60899033253,
        });
 */

        const carrier_service = new CarrierService({ session: session });
        carrier_service.name = "Jetz Provider";
        carrier_service.callback_url =
          "https://www.gabypro.com/apienvios/ejecutar.php";
        carrier_service.service_discovery = true;
        await carrier_service.save({});
      }

      const response = await formatTokenAccesoResponse(req, res, rawCodeData);
      res.status(200).send(response);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  /*
  app.get("/carrier", verifyRequest(app), async (req, res) => {

    console.log(1);
    const session = await Shopify.Utils.loadCurrentSession(req, res, true);
    const { CarrierService } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );

    const carrierTotal = await CarrierService.all({ session });

    console.log(carrierTotal);
    res.status(200).send(carrierTotal);
  });
  */

  // getSession

  // Generar Etiqueta
  app.get("/api/generaretiqueta/:id", async (req, res) => {
    try {
      const shopUrl = await getShopUrlFromSession(req, res);
      const rawCodeData = await TokenAccesoDB.list(shopUrl);

      let tokenActualShop = "";
      rawCodeData.map(({ token }, index) => (tokenActualShop = token));

      //let tokenActualShop2 = "";
      //rawCodeData.map(({ token }, index) => (tokenActualShop = token));

      //console.log(8);
      const rawCodeData22 = await EtiquetaDB.read(req.params.id);
      //console.log("valor:"+rawCodeData22);

      let idEtiquetaActual = rawCodeData22?.id;

      //const etiquetagenerada = await getEtiquetaOr404(req, res);
      let valor = 1;

      //console.log(9);
      //console.log(etiquetagenerada);

      // Ya existe la etiqueta generada
      if (
        idEtiquetaActual != null &&
        idEtiquetaActual != "" &&
        idEtiquetaActual != undefined
      ) {
        let valores = {
          data: [],
          code: 101,
          mensaje:
            "Ya se encuentra generada la etiqueta anteriormente de este pedido",
        };
        res.status(200).send(valores);
      } else {
        const session = await getSession(req, res);
        const rawCodeData = await Order.find({
          session: session,
          id: req.params.id,
        });

        //const response2 = await formatPedidosResponse(req, res, rawCodeData);

        let idPedidoShopify = rawCodeData.id;

        let namePedido = rawCodeData.name;
        let shipping_address_first_name =
          rawCodeData.shipping_address?.first_name;
        let shipping_address_last_name =
          rawCodeData.shipping_address?.last_name;
        let shipping_address_phone = rawCodeData.shipping_address?.phone;
        let shipping_address = rawCodeData.shipping_address?.address1;
        let shipping_province = rawCodeData.shipping_address?.province;
        let shipping_zip = rawCodeData.shipping_address?.zip;
        let shipping_city = rawCodeData.shipping_address?.city;
        let shipping_province_code =
          rawCodeData.shipping_address?.province_code;
        let shipping_country_code = rawCodeData.shipping_address?.country_code;
        let shipping_address2 = rawCodeData.shipping_address?.address2;
        let line_items = rawCodeData?.line_items;

        let origen_country_code = line_items[0]?.origin_location?.country_code;
        let origen_province_code =
          line_items[0]?.origin_location?.province_code;
        let origen_address1 = line_items[0]?.origin_location?.address1;
        let origen_city = line_items[0]?.origin_location?.city;
        let origen_zip = line_items[0]?.origin_location?.zip;

        const response = await axios.post(
          "http://www.gabypro.com/apienvios/ejecutar.php",
          {
            tipo: "generacion_etiqueta",
            token: tokenActualShop,
            origen: {
              nombre: "",
              rfc: "XAXX010101000",
              telefono: "",
              calle: origen_address1,
              numero_exterior: "",
              numero_interior: "",
              colonia: "",
              clave_localidad: "0",
              clave_municipio: "0",
              cp: origen_zip,
              ciudad: origen_city,
              iso_estado: origen_province_code,
              iso_pais: origen_country_code,
              cruce_1: "",
              cruce_2: "",
              descripcion: "",
              referencia: "",
            },
            destino: {
              nombre:
                shipping_address_first_name + " " + shipping_address_last_name,
              rfc: "XAXX010101000",
              telefono: shipping_address_phone,
              calle: shipping_address,
              numero_exterior: "",
              numero_interior: "",
              colonia: shipping_province,
              clave_localidad: "0",
              clave_municipio: "0",
              cp: shipping_zip,
              ciudad: shipping_city,
              iso_estado: shipping_province_code,
              iso_pais: shipping_country_code,
              cruce_1: shipping_address2,
              cruce_2: "",
              descripcion: "",
            },
            paquete: {
              peso: 1,
              alto: 0,
              ancho: 0,
              largo: 0,
              idServicio: 69,
              tipo_paquete: 1,
              contenido: line_items[0].name,
              contenido_detallado: "",
              seguro: 0,
              valor_declarado: "0",
            },
            items: [
              {
                clave_producto: line_items[0].product_id,
                descripcion_producto: line_items[0].name,
                clave_unidad: "",
                cantidad_producto: line_items[0].quantity,
                alto_producto: "0",
                ancho_producto: "0",
                largo_producto: "0",
                valor_producto: line_items[0].price,
                peso_producto: line_items[0].grams,
              },
            ],
          }
        );

        let idPedido = response.data.data.idPedido
          ? response.data.data.idPedido
          : 0;
        let numero_guia = response.data.data.numero_guia
          ? response.data.data.numero_guia
          : 0;
        let etiqueta = response.data.data.etiqueta
          ? response.data.data.etiqueta
          : "";
        //let idPedidoShopify = req.params.id;
        //let PedidoShop = req.params.id;

        const idEtiquetaDb = await EtiquetaDB.create({
          etiquetaUrl: etiqueta,
          proveedorOrdenEnvio: idPedido,
          numeroGuia: numero_guia,
          shopOrder: namePedido,
          shopOrderId: idPedidoShopify,
          shopDomain: shopUrl,
        });

        //console.log(4);

        res.status(200).send(response.data);
      }
    } catch (errormensaje) {
      console.log(1);
      console.log(errormensaje);
      let valores = {
        data: [],
        code: 101,
        mensaje: "Error: " + errormensaje,
      };
      res.status(200).send(valores);
    }
  });

  // Reimpresion de Etiqueta

  app.get("/api/reimpresionetiqueta/:id", async (req, res) => {
    try {
      //select a la base de datos de la tabla TokenAccesoDB
      const rawCodeData = await TokenAccesoDB.list(
        await getShopUrlFromSession(req, res)
      );

      //foreach para recorrer la lista que se devuelve de la base de datos
      let tokenActualShop = "";
      rawCodeData.map(({ token }, index) => (tokenActualShop = token));

      const rawCodeData22 = await EtiquetaDB.read(req.params.id);
      let numeroguia = rawCodeData22.numeroGuia;
      let proveedorOrdenEnvio = rawCodeData22.proveedorOrdenEnvio;

      const response = await axios.post(
        "http://www.gabypro.com/apienvios/ejecutar.php",
        {
          token: tokenActualShop,
          idPedido: proveedorOrdenEnvio,
          numero_guia: numeroguia,
          tipo: "reimpresion",
        }
      );
      res.status(200).send(response.data);
    } catch (errormensaje) {
      let valores = {
        data: [],
        code: 101,
        mensaje: "Error: " + errormensaje,
      };
      res.status(200).send(valores);
    }
  });

  // Generar Recoleccion
  app.get("/api/generarrecoleccion/:id", async (req, res) => {
    try {
      const rawCodeData = await TokenAccesoDB.list(
        await getShopUrlFromSession(req, res)
      );

      let tokenActualShop = "";
      rawCodeData.map(({ token }, index) => (tokenActualShop = token));

      const rawCodeData22 = await EtiquetaDB.read(req.params.id);
      let numeroguia = rawCodeData22.numeroGuia;
      let proveedorOrdenEnvio = rawCodeData22.proveedorOrdenEnvio;

      const response = await axios.post(
        "http://www.gabypro.com/apienvios/ejecutar.php",
        {
          tipo: "recoleccion",
          token: tokenActualShop,
          numero_guia: numeroguia,
          idPedido: proveedorOrdenEnvio,
        }
      );

      //console.log(11)
      res.status(200).send(response.data);
    } catch (errormensaje) {
      let valores = {
        data: [],
        code: 101,
        mensaje: "Error: " + errormensaje,
      };
      //console.log("error:"+errormensaje)
      res.status(200).send(valores);
    }
  });

  // Ver Rastreo del Pedido
  app.get("/api/rastreo/:id", async (req, res) => {
    try {
      const rawCodeData = await TokenAccesoDB.list(
        await getShopUrlFromSession(req, res)
      );

      let tokenActualShop = "";
      rawCodeData.map(({ token }, index) => (tokenActualShop = token));

      const rawCodeData22 = await EtiquetaDB.read(req.params.id);
      let numeroguia = rawCodeData22.numeroGuia;
      let proveedorOrdenEnvio = rawCodeData22.proveedorOrdenEnvio;

      const response = await axios.post(
        "http://www.gabypro.com/apienvios/ejecutar.php",
        {
          token: tokenActualShop,
          numero_guia: numeroguia,
          idPedido: proveedorOrdenEnvio,
          tipo: "rastreo",
        }
      );

      res.status(200).send(response.data);
    } catch (errormensaje) {
      let valores = {
        data: [],
        code: 101,
        mensaje: "Error: " + errormensaje,
      };
      res.status(200).send(valores);
    }
  });

  // Mostrar los Pedidos
  app.get("/api/pedidos", async (req, res) => {
    try {
      const session = await getSession(req, res);
      const rawCodeData = await Order.all({
        session: session,
        status: "any",
      });

      const response = await formatPedidosResponse(req, res, rawCodeData);

      //console.log(response);

      res.status(200).send(response);
    } catch (errormensaje) {
      let valores = {
        data: [],
        code: 101,
        mensaje: "Error: " + errormensaje,
      };
      res.status(200).send(valores);
    }
  });

  // Mostrar info de un token
  app.get("/api/tokenacceso/:id", async (req, res) => {
    const tokenacceso = await getTokenAccesoOr404(req, res);

    if (tokenacceso) {
      const formattedTokenAcceso = await formatTokenAccesoResponse(req, res, [
        tokenacceso,
      ]);
      res.status(200).send(formattedTokenAcceso[0]);
    }
  });

  // Eliminar un token
  app.delete("/api/tokenacceso/:id", async (req, res) => {
    const tokenacceso = await getTokenAccesoOr404(req, res);

    if (tokenacceso) {
      await TokenAccesoDB.delete(req.params.id);
      res.status(200).send();
    }
  });

  // Mostrar las etiquetas generadas
  app.get("/api/etiquetas", async (req, res) => {
    try {
      const rawCodeData = await EtiquetaDB.list(
        await getShopUrlFromSession(req, res)
      );

      const response = await formatEtiquetaResponse(req, res, rawCodeData);
      res.status(200).send(response);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
}
