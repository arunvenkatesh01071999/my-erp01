const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postCategorySchema = {
  tags: ["CATEGORY"],
  summary: "This API is to post categories",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["category_name", "is_active"],
    properties: {
      category_name: {
        type: "string",
        // pattern: "^[A-Za-z ]+$", // Allows only letters and spaces
        // errorMessage: "Category name should contain only alphabets and spaces."
      },
      is_active: { type: "boolean" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        insert_id: { type: "integer" }
      }
    },
    ...errorSchemas
  }
};

module.exports = postCategorySchema;
