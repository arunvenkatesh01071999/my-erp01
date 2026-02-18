const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getParentProductSchema = {
  tags: ["FMCG ParentProduct"],
  summary: "This API is to get FMCG ParentProduct",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          pro_code: { type: "string" },
          short_name: { type: "string" },
          pro_description: { type: "string" },
          regional_name: { type: "string" },
          pro_name: { type: "string" },
          bulk_item: { type: "boolean" },
          balance: { type: "number" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getParentProductSchema;
