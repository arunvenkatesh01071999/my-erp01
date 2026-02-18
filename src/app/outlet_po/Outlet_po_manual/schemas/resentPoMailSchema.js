const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const resentPoMailSchema = {
  tags: ["Outlet Purchase Mail Resent"],
  summary: "API to resent mail for outlet purchase orders",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["po_details"],
    properties: {
      po_details: {
        type: "array",
        description: "List of purchase order details to sent mail",
        items: {
          type: "object",
          required: ["outlet_id", "po_no"],
          properties: {
            outlet_id: { type: "integer", description: "Outlet ID of the PO" },
            po_no: { type: "string", description: "Purchase order number" },
          },
        },
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
      },
    },
    ...errorSchemas,
  },
};

module.exports = resentPoMailSchema;
