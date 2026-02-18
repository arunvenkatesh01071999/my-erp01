const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getOutletPoSchema = {
  tags: ["Outlet Purchase Order"],
  summary: "This API is to get Outlet purchase order no",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      company_id: { type: "integer" },
      outlet_id: { type: "integer" }
    },
    required: ["company_id"]
  },
  response: {
    200: {
      type: "object",
      properties: {
        Docno: { type: "string" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getOutletPoSchema;
