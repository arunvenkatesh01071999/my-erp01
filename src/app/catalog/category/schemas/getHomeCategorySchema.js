const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getHomeCategorySchema = {
  tags: ["CATEGORY"],
  summary: "This API is to fetch categories and sub categories",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          category_name: { type: "string" },
          is_active: { type: "boolean" },
          sub_categories: {
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
            }
          }
        }
      },
      meta: { $ref: "response-meta#" }
    },

    ...errorSchemas
  }
};

module.exports = getHomeCategorySchema;
