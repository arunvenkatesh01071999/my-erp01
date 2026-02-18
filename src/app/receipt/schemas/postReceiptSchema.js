// const { errorSchemas } = require("../../../commons/schemas/errorSchemas");
const { errorSchemas } = require("../../commons/schemas/errorSchemas")


const postReceiptSchema = {
  tags: ["HEADS"],
  summary: "This API is to post Purchase",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["supplierid", "amount", "company_id"],
    properties: {

      date: { type: "string" },
      supplierid: { type: "integer" },
      mode: { type: "number" },
      amount: { type: "number" },
      chequeno: { type: "string" },
      chequedate: { type: "string" },
      bank: { type: "string" },
      discount: { type: "number" },
      refno: { type: "string" },
      outstanding: { type: "number" },
      company_id: { type: "integer" },
      receipt_details: {
        type: "array",
        items: {
          type: "object",
          properties: {
            invoice_no: { type: "string" },
            date: { type: "string" },
            amount: { type: "integer" },
            pending_amount: { type: "integer" },
            company_id: { type: "integer" },
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

module.exports = postReceiptSchema;
