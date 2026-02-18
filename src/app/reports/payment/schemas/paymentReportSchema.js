const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getItemPaginateSchema = {
  tags: ["Item"],
  summary: "This API is to get Item",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      docno: { type: "integer" },
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              date: { type: "string" },
              docno: { type: "string" },
              party: { type: "integer" },
              remarks: { type: "string" },
              amount: { type: "integer" },
              mode: { type: "string" },
              cheque: { type: "integer" },
              bank: { type: "string" },

            }
          }
        },
        meta: { $ref: "response-meta#" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getItemPaginateSchema;
