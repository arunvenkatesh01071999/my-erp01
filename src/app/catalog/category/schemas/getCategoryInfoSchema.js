const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getCategoryInfoSchema = {
  tags: ["CATEGORY INFO"],
  summary: "This API is to fetch categories info",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      category_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        category_name: { type: "string" },
        is_active: { type: "boolean" }
      }
    },

    ...errorSchemas
  }
};

module.exports = getCategoryInfoSchema;
