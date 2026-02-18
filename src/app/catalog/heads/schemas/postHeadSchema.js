const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postHeadSchema = {
  tags: ["HEADS"],
  summary: "This API is to post Heads",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["cateogory_name", "company_id", "is_active"],
    properties: {
      cateogory_name: {
        type: "string"
      },
      company_id: { type: "integer" },
      is_active: { type: "boolean" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        insert_id: { type: "integer" }
      }
    },
    ...errorSchemas
  }
};

module.exports = postHeadSchema;
