const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getChildProductSchema = {
  tags: ["FNV ChildProduct"],
  summary: "This API is to get FNV ChildProduct",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      parent_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          pro_code: { type: "string" },
          pro_name: { type: "string" },
          pro_description: { type: "string" },
          parent_product_id: { type: "string" },
          product_weight: { type: "string" },
          units_short_name: { type: "string" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getChildProductSchema;
