const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteItemSchema = {
  tags: ["Item"],
  summary: "This API is to delete Item",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      id: { type: "integer" }
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

module.exports = deleteItemSchema;
