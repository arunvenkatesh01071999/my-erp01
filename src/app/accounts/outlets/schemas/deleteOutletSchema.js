const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteOutletSchema = {
  tags: ["DELETE OUTLETS"],
  summary: "This API is to delete outlets",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      outlet_id: { type: "integer" }
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

module.exports = deleteOutletSchema;
