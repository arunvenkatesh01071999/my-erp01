const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putMenuAuthSchema = {
  tags: ["PUT MENUAUTH"],
  summary: "This API is to post menuauth",
  headers: { $ref: "request-headers#" },

  body: {
    type: "object",
    required: ["is_active"],
    properties: {
      is_active: { type: "boolean" },
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

module.exports = putMenuAuthSchema;
