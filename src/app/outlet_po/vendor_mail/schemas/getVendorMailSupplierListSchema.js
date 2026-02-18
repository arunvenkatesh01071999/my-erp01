const { errorSchemas } = require("../../../commons/schemas/errorSchemas");
const getVendorMailSupplierListSchema = {
  tags: ["Suppliers"],
  summary: "API to list suppliers with detailed information",
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
      brand_company_id: { type: "integer" },
    }
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          supplier_id: { type: "integer" },
          supplier_code: { type: "string" },
          supplier_name: { type: "string" }

        }
      }
    },

    ...errorSchemas
  }
};

module.exports = getVendorMailSupplierListSchema;
