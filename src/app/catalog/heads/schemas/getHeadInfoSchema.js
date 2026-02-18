const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getHeadInfoSchema = {
  tags: ["HEADS INFO"],
  summary: "This API is to get Heads Info",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      head_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        cateogory_name: { type: "string" },
        company_id: { type: "integer" },
        is_active: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getHeadInfoSchema;
