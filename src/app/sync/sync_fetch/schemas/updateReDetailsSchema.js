const { errorSchemas } = require("../../../commons/schemas/errorSchemas");
const { params } = require("./getBrandsSchema");

const updateReDetailsSchema = {
  tags: ["UPDATE RATE ENTRY DETAILS"],
  summary: "API to update rate entry details status",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    required: ["tr_id"],
    properties: {
      tr_id: { type: "integer" },

    }
  },
  body: {
    type: "object",
    required: ["loc_id", "pro_id", "tr_date"],
    properties: {
      loc_id: { type: "integer" },
      pro_id: { type: "integer" },
      tr_date: { type: "string", format: "date" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
    ...errorSchemas,
  }
};

module.exports = updateReDetailsSchema;


