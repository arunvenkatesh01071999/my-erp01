const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSalesMasterUniqueDocnoSchema = {
  tags: ["getSalesMasterUniqueDocnoSchema"],
  summary: "This API is to get SALES DOCNO",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["outlet_id"],
    properties: {
      outlet_id: { type: "integer" },
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        Docno: { type: "string" },
      },
    },
    ...errorSchemas,
  },
};

module.exports = getSalesMasterUniqueDocnoSchema;
