const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getParentListSchema = {
  tags: ["Item"],
  summary: "This API returns the list of parent items",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      description: "Successful response",
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          product_name: { type: "string" }
        },
        required: ["id", "product_name"]
      }
    },
    ...errorSchemas
  }
};

module.exports = getParentListSchema;
