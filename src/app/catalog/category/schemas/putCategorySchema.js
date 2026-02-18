const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putCategorySchema = {
  tags: ["CATEGORY"],
  summary: "This API is to update categories",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      category_id: { type: "integer" }
    }
  },
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
        success: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = putCategorySchema;
