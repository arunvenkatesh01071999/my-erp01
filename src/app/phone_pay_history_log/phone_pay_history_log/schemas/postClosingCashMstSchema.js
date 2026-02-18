const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postPhonePayHistoryLogSchema = {
  tags: ["ClosingCashMaster"],
  summary: "This API is to post ClosingCashMaster",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["docno", "transaction_date", "merchant_order_id", "transaction_id", "phone_no"],
    properties: {
      docno: { type: "string", },
      transaction_date: { type: "string" },
      merchant_order_id: { type: "string" },
      transaction_id: { type: "string" },
      response_json: { type: "string" },
      request_json: { type: "string" },
      phone_no: { type: "string" },
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        docno: { type: "string" }
      }
    },
    ...errorSchemas
  }
};

module.exports = postPhonePayHistoryLogSchema;
