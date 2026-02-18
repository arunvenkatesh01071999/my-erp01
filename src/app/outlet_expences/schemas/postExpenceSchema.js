const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postHeadSchema = {
  tags: ["HEADS"],
  summary: "This API is to post Purchase",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["docdate", "accid", "amount", "outletid", "remarks", "company_id"],
    properties: {
      docdate: { type: "string" },
      accid: { type: "integer" },
      amount: { type: "number" },
      outletid: { type: "integer" },
      remarks: { type: "string" },
      company_id: { type: "integer" },

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

module.exports = postHeadSchema;
