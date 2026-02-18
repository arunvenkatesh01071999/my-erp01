const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteCategorySchema = {
  tags: ["CATEGORY"],
  summary: "This API is to delete categories",
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
        success: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = deleteCategorySchema;
