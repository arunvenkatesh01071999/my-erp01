const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getConsumerInfoSchema = {
  tags: ["TYPEDESIGN INFO"],
  summary: "This API is to get TYPEDESIGN Info",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      typedesign_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        type_name: { type: "string" },
        company_id: { type: "integer" },
        is_active: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getConsumerInfoSchema;
