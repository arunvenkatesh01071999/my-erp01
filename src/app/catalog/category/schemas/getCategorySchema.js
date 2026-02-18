const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getCategorySchema = {
  tags: ["CATEGORY"],
  summary: "This API is to fetch categories",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          category_name: { type: "string" },
          is_active: { type: "boolean" }
        }
      },
      meta: { $ref: "response-meta#" }
    },

    ...errorSchemas
  }
};

module.exports = getCategorySchema;
