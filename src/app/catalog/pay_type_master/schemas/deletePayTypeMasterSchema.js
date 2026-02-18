const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deletePayTypeMasterSchema = {
  tags: ["PayTypeMaster"],
  summary: "This API is to delete PayTypeMaster",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      id: { type: "integer" }
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

module.exports = deletePayTypeMasterSchema;
