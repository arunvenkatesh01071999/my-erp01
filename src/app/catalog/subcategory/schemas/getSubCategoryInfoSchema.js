const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSubCategoryInfoSchema = {
  tags: ["SUB CATEGORY INFO"],
  summary: "This API is to fetch sub categories info ",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      subcategory_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        subcategory_name: { type: "string" },
        category_id: { type: "integer" },
        category_name: { type: "string" },
        is_active: { type: "boolean" }
      }
    },

    ...errorSchemas
  }
};

module.exports = getSubCategoryInfoSchema;
