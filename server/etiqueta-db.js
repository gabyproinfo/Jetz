/*
  This file interacts with the app's database and is used by the app's REST APIs.
*/

import sqlite3 from "sqlite3";
import path from "path";
import { Shopify } from "@shopify/shopify-api";

const DEFAULT_DB_FILE = path.join(process.cwd(), "etiqueta_db.sqlite");
const DEFAULT_PURCHASE_QUANTITY = 1;

export const EtiquetaDB = {
  etiquetaTableName: "etiqueta",
  db: null,
  ready: null,

  create: async function ({
    shopDomain,
    shopOrder,
    shopOrderId,
    etiquetaUrl,
    proveedorOrdenEnvio,
    numeroGuia,
  }) {
    await this.ready;

    const query = ` 
      INSERT INTO ${this.etiquetaTableName}
      (shopDomain, shopOrder, shopOrderId, etiquetaUrl, proveedorOrdenEnvio, numeroGuia)
      VALUES (?, ?, ?, ?, ?, ?)
      RETURNING id;
    `;

    const rawResults = await this.__query(query, [
      shopDomain,
      shopOrder,
      shopOrderId,
      etiquetaUrl,
      proveedorOrdenEnvio,
      numeroGuia,
    ]);

    return rawResults[0].id;
  },

  update: async function (
    id,
    { shopOrder, shopOrderId, etiquetaUrl, proveedorOrdenEnvio, numeroGuia }
  ) {
    await this.ready;

    const query = `
      UPDATE ${this.etiquetaTableName}
      SET
        shopOrder = ?,
        shopOrderId = ?,
        etiquetaUrl = ?,
        proveedorOrdenEnvio = ?,
        numeroGuia = ?    
      WHERE
        id = ?;
    `;

    await this.__query(query, [
      shopOrder,
      shopOrderId,
      etiquetaUrl,
      proveedorOrdenEnvio,
      numeroGuia,
      id,
    ]);
    return true;
  },

  list: async function (shopDomain) {
    await this.ready;
    const query = `
      SELECT * FROM ${this.etiquetaTableName}
      WHERE shopDomain = ? ORDER BY id DESC;
    `;

    const results = await this.__query(query, [shopDomain]);

    return results.map((etiqueta) => this.__addImageUrl(etiqueta));
  },

  read: async function (id) {
    await this.ready;
    const query = `
      SELECT * FROM ${this.etiquetaTableName}
      WHERE CAST(shopOrderId AS INTEGER) = ?;
    `;
    //console.log("id2:"+id)
    const rows = await this.__query(query, [id]);
    /*
    console.log(rows.length);
    if (!Array.isArray(rows) || rows?.length !== 1) {
      console.log("aa")
      return undefined;
    }

    console.log("aqui")
    */

    return this.__addImageUrl(rows[0]);
  },

  delete: async function (id) {
    await this.ready;
    const query = `
      DELETE FROM ${this.etiquetaTableName}
      WHERE id = ?;
    `;
    await this.__query(query, [id]);
    return true;
  },

  /* Private */

  /*
    Used to check whether to create the database.
    Also used to make sure the database and table are set up before the server starts.
  */

  __hasEtiquetaTable: async function () {
    const query = `
      SELECT name FROM sqlite_schema
      WHERE
        type = 'table' AND
        name = ?;
    `;
    const rows = await this.__query(query, [this.etiquetaTableName]);
    return rows.length === 1;
  },

  /* Initializes the connection with the app's sqlite3 database */
  init: async function () {
    /* Initializes the connection to the database */
    this.db = this.db ?? new sqlite3.Database(DEFAULT_DB_FILE);

    const hasEtiquetaTable = await this.__hasEtiquetaTable();

    if (hasEtiquetaTable) {
      this.ready = Promise.resolve();

      /* Create the QR code table if it hasn't been created */
    } else {
      const query = `
        CREATE TABLE ${this.etiquetaTableName} (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          shopDomain VARCHAR(511) NOT NULL,
          shopOrder VARCHAR(511) NOT NULL,
          shopOrderId VARCHAR(511) NOT NULL,
          etiquetaUrl VARCHAR(2000) NOT NULL,
          proveedorOrdenEnvio VARCHAR(511) NOT NULL,
          numeroGuia VARCHAR(511) NOT NULL,
          
          createdAt DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime'))
        )
      `;

      /* Tell the various CRUD methods that they can execute */
      this.ready = this.__query(query);
    }
  },

  /* Perform a query on the database. Used by the various CRUD methods. */
  __query: function (sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  },

  __addImageUrl: function (tokenacceso) {
    return tokenacceso;
  },
};
