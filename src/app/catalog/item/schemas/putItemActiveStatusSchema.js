const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putItemActiveStatusSchema = {
  tags: ["Item"],
  summary: "This API is to update status Item",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      product_id: { type: "integer" },
      company_id: { type: "integer" }
    }
  },
  body: {
    type: "object",
    properties: {
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

module.exports = putItemActiveStatusSchema;