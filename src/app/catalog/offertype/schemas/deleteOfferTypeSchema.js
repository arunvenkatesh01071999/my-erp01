const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteOfferTypeSchema = {
  tags: ["OFFER TYPE"],
  summary: "This API is to delete offer type",
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
        success: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = deleteOfferTypeSchema;
