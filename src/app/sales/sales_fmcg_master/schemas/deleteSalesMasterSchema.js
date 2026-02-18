const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteSalesMasterSchema = {
  tags: ["SalesMaster"],
  summary: "This api is delete sales master",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      sale_id: { type: "integer" }
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = deleteSalesMasterSchema;
