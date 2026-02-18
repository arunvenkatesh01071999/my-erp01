const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postWastageMasterSchema = {
  tags: ["WastageMaster"],
  summary: "This API is to post WastageMaster",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: [ "date", "amount", "company_id"],
    properties: {
      date: { type: "string" },
      amount: { type: "number" },
      totalQty: { type: "number" },
      company_id: { type: "integer" },
      wastage_detail: {
        type: "array",
        items: {
          type: "object",
          properties: {
            date: { type:"string"},
            prodid:{ type: "integer"},
            qty: { type:"number"},
            rate:{ type: "number"},
            amount: { type:"number"},
            reason:{ type: "string"},
            company_id:{ type: "integer"}
          },
        },
      },

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

module.exports = postWastageMasterSchema;
