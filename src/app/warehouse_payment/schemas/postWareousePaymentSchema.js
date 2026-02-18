const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postWarehousePaymentSchema = {
  tags: ["HEADS"],
  summary: "This API is to post Payment",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["supplier_id", "amount", "warehouse_id"],
    properties: {
      date: { type: "string" },
      supplier_id: { type: "integer" },
      mode: { type: "number" },
      amount: { type: "number" },
      cheque_no: { type: "string" },
      cheque_date: { type: "string" },
      bank: { type: "string" },
      discount: { type: "number" },
      ref_no: { type: "string" },
      company_id: { type: "integer" },
      warehouse_id: { type: "integer" },
      warhouse_payment_details: {
        type: "array",
        items: {
          type: "object",
          properties: {
            invoice_no: { type: "string" },
            bill_date: { type: "string" },
            bill_amount: { type: "integer" },
            pending_amount: { type: "integer" }
          }
        }
      }
    }
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

module.exports = postWarehousePaymentSchema;
