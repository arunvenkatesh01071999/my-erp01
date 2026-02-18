const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const clearCartSchema = {
  tags: ["CART"],
  summary: "This API is used to clear the Cart",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "string" }
      }
    },
    ...errorSchemas
  }
};

module.exports = clearCartSchema;
