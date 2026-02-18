const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getGroupMasterSchema = {
  tags: ["GROUPMASTER"],
  summary: "This API is to get group master",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          group_name: { type: "string" },
          company_id: { type: "integer" },
          is_active: { type: "boolean" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getGroupMasterSchema;
