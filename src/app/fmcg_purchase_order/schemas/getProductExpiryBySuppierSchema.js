const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getProductExpiryBySupplierSchema = {
  tags: ["EXPIRY PURCHASE ORDER"],
  summary: "API to list products expiry purchase order",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      vendor_id: { type: "integer" },
      company_id: { type: "integer" }
    },
    required: ["vendor_id"]
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          supplier_name: { type: "string" },
          pono: { type: "string" },
          podate: { type: "string", format: "date" } // Corrected type
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getProductExpiryBySupplierSchema;
