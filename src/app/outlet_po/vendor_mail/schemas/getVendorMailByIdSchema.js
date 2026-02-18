const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getVendorMailByIdSchema = {
  tags: ["VENDOR MAIL"],
  summary: "This API is to get vendor mail details by id",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          region_id: { type: "integer" },
          region_name: { type: "string" },
          outlet_id: { type: "integer" },
          outlet_name: { type: "string" },
          brand_company_id: { type: "integer" },
          brand_company_name: { type: "string" },
          supplier_id: { type: "integer" },
          supplier_name: { type: "string" },
          outlet_email: {
            type: "array",
            items: { type: "string", format: "email" }
          },

          brand_company_email: {
            type: "array",
            items: { type: "string", format: "email" }
          },

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

module.exports = getVendorMailByIdSchema;
