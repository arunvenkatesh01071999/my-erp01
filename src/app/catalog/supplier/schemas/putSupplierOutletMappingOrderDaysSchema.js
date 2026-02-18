const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putSupplierOutletMappingOrderDaysSchema = {
  tags: ["UPDATE SUPPLIER OUTLET MAPPING ORDER DAYS"],
  summary: "This API is to update supplier oultet order days",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      supplier_id: { type: "integer" },
      outlet_id: { type: "integer" },
      company_id: { type: "integer" },
      brand_company_id: { type: "integer" }
    }
  },
  body: {
    type: "object",
    properties: {
      sunday: { type: "boolean" },
      monday: { type: "boolean" },
      tuesday: { type: "boolean" },
      wednesday: { type: "boolean" },
      thursday: { type: "boolean" },
      friday: { type: "boolean" },
      saturday: { type: "boolean" }
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = putSupplierOutletMappingOrderDaysSchema;
