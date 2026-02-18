const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getPurchaseReturnListSchema = {
  tags: ["Item INFO"],
  summary: "This API is to get Item Info",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      from_date: { type: "string" },
      to_date: { type: "string" }
    },
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          purchase_master_id: { type: "integer" },
          supplier_id: {
            type: "object",
            properties: {
              id: { type: "integer" },
              supplier_name: { type: "string" },
              add1: { type: "string" },
              add2: { type: "string" },
              add3: { type: "string" },
              add4: { type: "string" },
              gst: { type: "boolean" },
              igst: { type: "boolean" }
            }
          },
          purchase_date: { type: "string", format: "date" },
          invoice_no: { type: "string" },
          invoice_date: { type: "string", format: "date" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getPurchaseReturnListSchema;
