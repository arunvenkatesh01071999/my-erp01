const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteSubCategorySchema = {
  tags: ["CATEGORY"],
  summary: "This API is to delete subcategories",
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
        success: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = deleteSubCategorySchema;
