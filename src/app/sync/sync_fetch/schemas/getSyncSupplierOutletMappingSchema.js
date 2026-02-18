const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSyncSupplierOutletMappingSchema = {
  tags: ["SYNC SUPPLIER OUTLET MAPPING"],
  summary: "API to list sync supplier outlet mapping order days",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      outlet_id: { type: "integer" }
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
          customer_code: { type: "string" },
          new_code: { type: "string" },
          old_code: { type: "string" },
          supplier_name: { type: "string" },
          local_supplier_mapping: { type: "boolean" },
          outlet_id: { type: "integer" },
          outlet_name: { type: "string" },
          store_code: { type: "string" },
          tn_gstin:{ type: "string" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getSyncSupplierOutletMappingSchema;
