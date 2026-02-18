const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putMerchantCategorySchema = {
  tags: [""],
  summary: "This API is to update incharge master",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      merchantcategory_id: { type: "integer" }
    }
  },
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

module.exports = putMerchantCategorySchema;
