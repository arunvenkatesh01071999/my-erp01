const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deletePurchaseMasterSchema = {
  tags: ["Purchase Master Schema"],
  summary: "This API is to Delete Purchase Master",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      purchase_id: { type: "integer" }
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

module.exports = deletePurchaseMasterSchema;
