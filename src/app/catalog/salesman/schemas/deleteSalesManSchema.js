const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteSalesManSchema = {
  tags: ["SalesMan"],
  summary: "This API is to delete SalesMan",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      salesMan_id: { type: "integer" }
    }
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

module.exports = deleteSalesManSchema;
