const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getInchageGroupMasterInfoSchema = {
  tags: ["INCHAGE GROUP MASTER INFO"],
  summary: "This API is to get incharge group master",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      inchargegroupmaster_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        group_name: { type: "string" },
        company_id: { type: "integer" },
        is_active: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getInchageGroupMasterInfoSchema;
