const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putOutletSchema = {
  tags: ["UPDATE OUTLETS"],
  summary: "This API is to update outlets",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      company_id: { type: "integer" },
      wh_id: { type: "integer" },
      outlet_id: { type: "integer" },
      counter: { type: "integer" }
    }
  },
  body: {
    type: "object",
    required: [
      "bill_sequence",
      "bill_no_type"
    ],
    properties: {
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

module.exports = putOutletSchema;
