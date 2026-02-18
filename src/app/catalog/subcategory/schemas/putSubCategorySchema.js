const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putSubCategorySchema = {
  tags: ["CATEGORY"],
  summary: "This API is to update subcategories",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      subcategory_id: { type: "integer" }
    }
  },
  body: {
    type: "object",
    required: [
      "subcategory_name",
      "category_id",
      "is_active"
    ],
    properties: {
      subcategory_name: {
        type: "string",
        // pattern: "^[A-Za-z ]+$", // Allows only letters and spaces
        // errorMessage: "SubCategory name should contain only alphabets and spaces."
      },
      category_id: { type: "integer" },
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

module.exports = putSubCategorySchema;
