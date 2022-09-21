/*
  This file interacts with the app's database and is used by the app's REST APIs.
*/

import sqlite3 from "sqlite3";
import path from "path";
import { Shopify } from "@shopify/shopify-api";

const DEFAULT_DB_FILE = path.join(process.cwd(), "tokenacceso_db.sqlite");
const DEFAULT_PURCHASE_QUANTITY = 1;

export const TokenAccesoDB = {
  tokenaccesoTableName: "tokenacceso",
  db: null,
  ready: null,

  create: async function ({ shopDomain, token, url }) {
    await this.ready;

    const query = `
      INSERT INTO ${this.tokenaccesoTableName}
      (shopDomain, token, url)
      VALUES (?, ?, ?)
      RETURNING id;
    `;

    const rawResults = await this.__query(query, [shopDomain, token, url]);

    return rawResults[0].id;
  },

  update: async function (id, { token, url }) {
    await this.ready;

    const query = `
      UPDATE ${this.tokenaccesoTableName}
      SET
        token = ? ,
        url = ?       
      WHERE
        id = ?;
    `;

    await this.__query(query, [token, url, id]);
    return true;
  },

  list: async function (shopDomain) {
    await this.ready;
    const query = `
      SELECT * FROM ${this.tokenaccesoTableName}
      WHERE shopDomain = ?;
    `;

    const results = await this.__query(query, [shopDomain]);

    return results.map((tokenacceso) => this.__addImageUrl(tokenacceso));
  },

  read: async function (id) {
    await this.ready;
    const query = `
      SELECT * FROM ${this.tokenaccesoTableName}
      WHERE id = ?;
    `;
    const rows = await this.__query(query, [id]);
    if (!Array.isArray(rows) || rows?.length !== 1) return undefined;

    return this.__addImageUrl(rows[0]);
  },

  delete: async function (id) {
    await this.ready;
    const query = `
      DELETE FROM ${this.tokenaccesoTableName}
      WHERE id = ?;
    `;
    await this.__query(query, [id]);
    return true;
  },

  /* The destination URL for a QR code is generated at query time */
  generateQrcodeDestinationUrl: function (qrcode) {
    return `${Shopify.Context.HOST_SCHEME}://${Shopify.Context.HOST_NAME}/tokenacceso/${qrcode.id}/scan`;
  },

  /* Private */

  /*
    Used to check whether to create the database.
    Also used to make sure the database and table are set up before the server starts.
  */

  __hasTokenAccesoTable: async function () {
    const query = `
      SELECT name FROM sqlite_schema
      WHERE
        type = 'table' AND
        name = ?;
    `;
    const rows = await this.__query(query, [this.tokenaccesoTableName]);
    return rows.length === 1;
  },

  /* Initializes the connection with the app's sqlite3 database */
  init: async function () {
    /* Initializes the connection to the database */
    this.db = this.db ?? new sqlite3.Database(DEFAULT_DB_FILE);

    const hasTokenAccesoTable = await this.__hasTokenAccesoTable();

    if (hasTokenAccesoTable) {
      this.ready = Promise.resolve();

      /* Create the QR code table if it hasn't been created */
    } else {
      const query = `
        CREATE TABLE ${this.tokenaccesoTableName} (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          shopDomain VARCHAR(511) NOT NULL,
          token VARCHAR(511) NOT NULL,
          url VARCHAR(2000) NOT NULL,
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
