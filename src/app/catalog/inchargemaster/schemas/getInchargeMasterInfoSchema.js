const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getInchageMasterInfoSchema = {
  tags: ["INCHAGE MASTER INFO"],
  summary: "This API is to get incharge group master",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      inchargemaster_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        incharge_name: { type: "string" },
        incharge_group_id: { type: "integer" },
        company_id: { type: "integer" },
        is_active: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getInchageMasterInfoSchema;
