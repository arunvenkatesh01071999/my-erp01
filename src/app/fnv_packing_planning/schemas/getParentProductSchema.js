const { errorSchemas } = require("../../commons/schemas/errorSchemas");
const { params } = require("./getChildProductSchema");

const getParentProductSchema = {
  tags: ["FNV ParentProduct"],
  summary: "This API is to get FNV ParentProduct",
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
          bulk_item: { type: "boolean" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getParentProductSchema;
