const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getVendorMailExcelExportSchema = {
  tags: ["VENDOR MAIL"],
  summary: "This API is to get vendor mail details",
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
          region_name: { type: "string" },
          outlet_name: { type: "string" },
          outlet_email: {
            type: "array",
            items: { type: "string", format: "email" }
          },
          brand_company_name: { type: "string" },
          brand_company_email: {
            type: "array",
            items: { type: "string", format: "email" }
          },
          supplier_name: { type: "string" },
          supplier_email: {
            type: "array",
            items: { type: "string", format: "email" }
          },
          is_active: { type: "boolean" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getVendorMailExcelExportSchema;
