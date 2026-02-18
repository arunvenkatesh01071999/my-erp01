const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putItemSupplierOrderDaysSchema = {
  tags: ["Item Supplier Order Days"],
  summary: "This API is to update Item Supplier Mapping Order Days",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      company_id: { type: "integer" },
      outlet_id: { type: "integer" },
      supplier_id: { type: "integer" }
    },
    required: ["company_id", "outlet_id", "supplier_id"]
  },
  body: {
    type: "object",
    properties: {
      product_id: { type: "integer" },
      product_code: { type: "string" }, // 🔑 FIXED here
      sunday: { type: "boolean" },
      monday: { type: "boolean" },
      tuesday: { type: "boolean" },
      wednesday: { type: "boolean" },
      thursday: { type: "boolean" },
      friday: { type: "boolean" },
      saturday: { type: "boolean" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = putItemSupplierOrderDaysSchema;
