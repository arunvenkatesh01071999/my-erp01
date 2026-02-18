const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postMerchantCategorySchema = {
  tags: ["MERCHANTCATEGORY"],
  summary: "This API is to post merchant category",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["category_name", "company_id", "is_active"],
    properties: {
      category_name: {
        type: "string",
        pattern: "^[A-Za-z0-9 ]+$", // Allows letters, numbers, and spaces
        errorMessage: "Category name should contain only alphabets, numbers, and spaces."
      },
      is_active: { type: "boolean" },
      company_id: { type: "integer" }
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

module.exports = postMerchantCategorySchema;
