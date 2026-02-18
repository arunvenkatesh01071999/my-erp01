const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getMerchantCategoryInfoSchema = {
  tags: ["MERCHANT CATEGORY INFO"],
  summary: "This API is to get merchant category",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      inchargeMaster_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        merchant_category_name: { type: "string" },
        company_id: { type: "integer" },
        is_active: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getMerchantCategoryInfoSchema;
