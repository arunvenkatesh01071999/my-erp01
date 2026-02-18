const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postPayTypeMasterSchema = {
  tags: ["PayTypeMaster"],
  summary: "This API is to post PayTypeMaster",
  headers: { $ref: "request-headers#" },
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

module.exports = postPayTypeMasterSchema;
