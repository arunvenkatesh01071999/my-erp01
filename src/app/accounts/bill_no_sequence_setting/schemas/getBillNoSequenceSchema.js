const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getBillNoSequenceSchema = {
  tags: ["bill no sequence"],
  summary: "This API is to get bill no sequence",
  headers: { $ref: "request-headers#" },

  params: {
    type: "object",
    properties: {
      company_id: { type: "integer" },
      wh_id: { type: "integer" },
      outlet_id: { type: "integer" },
      counter: { type: "integer" }
    },
    required: ["company_id", "wh_id", "outlet_id", "counter"]
  },

  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        company_id: { type: "integer" },
        wh_id: { type: "integer" },
        outlet_id: { type: "integer" },
        outlet_name: { type: "string" },
        counter: { type: "integer" },
        bill_sequence: { type: "integer" },
        bill_no_type: { type: "integer" }
      }
    },

    ...errorSchemas
  }
};

module.exports = getBillNoSequenceSchema;
