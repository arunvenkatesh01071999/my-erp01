const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSupplierOutletOrderDaysExportSchema = {
  tags: ["SUPPLIER Outlet Mapping Export"],
  summary: "API to list Supplier outlet mapping export",
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
          supplier_code: { type: "string" },
          supplier_name: { type: "string" },
          outlet_id: { type: "integer" },
          stroe_code: { type: ["string", "null"] },
          outlet_name: { type: ["string", "null"] },
          // Outlet working days
          sunday: { type: "boolean" },
          monday: { type: "boolean" },
          tuesday: { type: "boolean" },
          wednesday: { type: "boolean" },
          thursday: { type: "boolean" },
          friday: { type: "boolean" },
          saturday: { type: "boolean" },
        },
      },
    },
    ...errorSchemas,
  },
};

module.exports = getSupplierOutletOrderDaysExportSchema;
