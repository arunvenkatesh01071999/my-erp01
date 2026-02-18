const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getConsumerInfoSchema = {
  tags: ["ACCOUNTMASTER INFO"],
  summary: "This API is to get ACCOUNTMASTER Info",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      acc_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        acname: { type: "string" },
        actype_id: { type: "integer" },
        company_id: { type: "integer" },
        is_active: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getConsumerInfoSchema;
