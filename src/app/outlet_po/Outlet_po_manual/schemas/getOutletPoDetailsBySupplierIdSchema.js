const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getOutletPoDetailsBySupplierIdSchema = {
  tags: ["Outlet PURCHASE ORDER BY SUPPLIERID"],
  summary: "API to list detailed PO overview by supplier ID",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      supplier_id: { type: "integer" }
    },
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          purchase_order_number: { type: "string", example: "2" },
          purchase_order_date: { type: "string", format: "date", example: "2025-10-08" },
          supplier_name: { type: "string", example: "KPN FMCG" },
          outlet_name: { type: "string", example: "Haralur" },
          total_order_qty: { type: "number", example: 6 },
          sub_total_amount: { type: "number", example: 600 },
          grand_total_amount: { type: "number", example: 1500 },
          supplier_id: { type: "integer", example: 2 }
        },
      }
    },
    ...errorSchemas
  }
};

module.exports = getOutletPoDetailsBySupplierIdSchema;
