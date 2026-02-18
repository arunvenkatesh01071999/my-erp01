const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getOfferMasterInfoSchema = {
  tags: ["Offer Master"],
  summary: "This API is to get Offer Master Info",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      oid: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        oid: { type: "integer" },
        oname: { type: "string" },
        otype: { type: "integer" },
        obuy: { type: "integer" },
        oget: { type: "integer" },
        pfrom: { type: "string", format: "date-time" },
        pto: { type: "string", format: "date-time" },
        active: { type: "boolean" },
        uid: { type: "integer" },
        dis: { type: "number" },
        poff: { type: "number" },
        omode: { type: "integer" },
        pcompamt: { type: "number" },
        plocamt: { type: "number" },
        company_id: { type: "integer" },
        obuyid: { type: ["integer"] },
        ogetid: { type: ["integer"] },
        buy_product_name: { type: "string" },
        get_product_name: { type: "string" },
        get_pro_code: { type: "string" },
        buy_pro_code: { type: "string" },
        created_at: { type: "string" },
        updated_at: { type: "string" },
        outlets_lines: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              short_name: { type: "string" },
              fullname: { type: "string" },
              code: { type: "string" },
            }
          }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getOfferMasterInfoSchema;
