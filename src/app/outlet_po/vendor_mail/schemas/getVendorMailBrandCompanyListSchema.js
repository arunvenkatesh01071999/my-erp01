const { errorSchemas } = require("../../../commons/schemas/errorSchemas");
const getVendorMailBrandCompanyListSchema = {
  tags: ["Brand Company"],
  summary: "API to list Brand Company with detailed information",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["outlet_id", "region_id"],
    properties: {
      outlet_id: {
        type: "array",
        items: { type: "integer" }
      },
      region_id: { type: "integer" },
    }
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          brand_company_id: { type: "integer" },
          brand_company_name: { type: "string" }
        }
      }
    },

    ...errorSchemas
  }
};

module.exports = getVendorMailBrandCompanyListSchema;
