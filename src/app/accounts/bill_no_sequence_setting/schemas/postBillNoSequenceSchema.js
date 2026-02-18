const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postBillNoSequenceSchema = {
  tags: ["CREATE BillNoSequence"],
  summary: "This API is to create BillNoSequence",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: [
      "company_id",
      "wh_id",
      "outlet_id",
      "counter",
      "bill_sequence",
      "bill_no_type"
    ],
    properties: {
      company_id: { type: "integer" },
      wh_id: { type: "integer" },
      outlet_id: { type: "integer" },
      counter: { type: "integer" },
      bill_sequence: { type: "integer" },
      bill_no_type: { type: "integer" }
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

module.exports = postBillNoSequenceSchema;
