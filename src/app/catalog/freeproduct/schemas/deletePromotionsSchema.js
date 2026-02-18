const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deletePromotionsSchema = {
  tags: ["Free Product"],
  summary: "This API is to delete Free Product",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      sid: { type: "integer" }
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

module.exports = deletePromotionsSchema;
