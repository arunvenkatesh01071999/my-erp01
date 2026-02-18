const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getOutletPoDetailsOverviesSchema = {
  tags: ["Outlet PURCHASE ORDER OVERVIEW"],
  summary: "API to list overall PO overview supplier wise",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          supplier_id: { type: "integer" },
          supplier_name: { type: "string" },
          total_order_qty: { type: "number" },
          total_amount: { type: "number" },
          total_order_items: { type: "number" },
          no_of_outlets: { type: "number" }
        },
        required: ["supplier_id", "supplier_name", "total_order_qty", "total_order_items", "total_amount"]
      }
    },
    ...errorSchemas
  }
};

module.exports = getOutletPoDetailsOverviesSchema;
