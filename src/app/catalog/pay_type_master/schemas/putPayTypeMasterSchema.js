const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putPayTypeMasterSchema = {
  tags: ["PayTypeMaster"],
  summary: "This API is to update PayTypeMaster",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      id: { type: "integer" }
    }
  },
  body: {
    type: "object",
    required: ["pay_type_name", "pay_type_key", "is_active"],
    properties: {
      pay_type_name: { type: "string" },
      pay_type_key: { type: "string" },
      is_active: { type: "boolean" }
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

module.exports = putPayTypeMasterSchema;
