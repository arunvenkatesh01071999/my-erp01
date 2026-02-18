const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getPackingPlanningDocnoSchema = {
  tags: ["Fetch FMCG PackingPlanning Doc No"],
  summary: "This API is for managing PackingPlanning.",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      wh_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        docno: { type: "string" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getPackingPlanningDocnoSchema;
