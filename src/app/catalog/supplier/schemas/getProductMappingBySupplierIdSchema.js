const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getProductMappingBySupplierIdSchema = {
  tags: ["GET PRODUCT MAPPING BY SUPPLIER "],
  summary: "API to list  Supplier outlet mapping export",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      company_id: { type: "integer" },
      outlet_id: { type: "integer" },
    },
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          SKUCode: { type: "string" },
          OutletCode: { type: "string" },
          OutletCode: { type: "string" },
          OutletName: { type: "string" },
          SupplierCode: { type: "string" },
          SupplierName: { type: "string" }
        },
      },
    },
    ...errorSchemas,
  },
};

module.exports = getProductMappingBySupplierIdSchema;
