const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getItemPurchaseProductSchema = {
  tags: ["Item INFO"],
  summary: "This API is to get Item Info",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          main_product_id: { type: "integer" },
          pro_name: { type: "string" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getItemPurchaseProductSchema;
