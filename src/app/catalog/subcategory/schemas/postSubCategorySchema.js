const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postSubCategorySchema = {
  tags: ["CATEGORY"],
  summary: "This API is to post categories",
  headers: { $ref: "request-headers#" },
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
        success: { type: "boolean" },
        insert_id: { type: "integer" },
      }
    },
    ...errorSchemas
  }
};

module.exports = postSubCategorySchema;
