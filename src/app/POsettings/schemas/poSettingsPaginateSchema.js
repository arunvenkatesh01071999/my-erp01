const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getWhdcPaginateSchema = {
  tags: ["WHDC"],
  summary: "This API is to get warehouse grns",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["Flag", "Locid"],
    properties: {
      Flag: { type: "integer" },
      Locid: { type: "integer" }
    }
  },

  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              Locid: { type: "integer" },
              Code: { type: "integer" },
              SaleDays: { type: "integer" },
              Times: { type: "integer" },
              MinMbq: { type: "integer" },
              Flag: { type: "integer" },
              U_ID: { type: "integer" },
              LastUpdate: { type: "string" },
              Ctype: { type: "integer" },
              VLT: { type: "integer" },
              Paway: { type: "integer" },
              PackQty: { type: "number" }
            }
          }
        },
        meta: { $ref: "response-meta#" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getWhdcPaginateSchema;
