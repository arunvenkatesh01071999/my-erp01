const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getMerchantCategorySchema = {
  tags: ["MERCHANTCATEGORY"],
  summary: "This API is to get merchant category",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          merchant_category_name: { type: "string" },
          company_id: { type: "integer" },
          is_active: { type: "boolean" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getMerchantCategorySchema;
