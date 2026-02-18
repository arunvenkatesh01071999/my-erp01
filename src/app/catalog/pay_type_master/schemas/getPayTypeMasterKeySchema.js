const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getPayTypeMasterKeySchema = {
  tags: ["PayType Master INFO"],
  summary: "This API is to get PayType Master Info",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      pay_type_key: { type: "string" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        pay_type_name: { type: "string" },
        pay_type_key: { type: "string" },
        is_active: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getPayTypeMasterKeySchema;
