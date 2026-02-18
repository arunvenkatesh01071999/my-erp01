const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSubCategorySchema = {
  tags: ["CATEGORY"],
  summary: "This API is to fetch sub categories",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          subcategory_name: { type: "string" },
          category_id: { type: "integer" },
          category_name: { type: "string" },
          is_active: { type: "boolean" }
        }
      },
      meta: { $ref: "response-meta#" }
    },

    ...errorSchemas
  }
};

module.exports = getSubCategorySchema;
