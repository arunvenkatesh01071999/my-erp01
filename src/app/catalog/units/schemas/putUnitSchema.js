const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putUnitSchema = {
  tags: ["Group"],
  summary: "This API is to update groups",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      unit_id: { type: "integer" }
    }
  },
  body: {
    type: "object",
    required: [
      "units_short_name",
      "units_long_name",
      "company_id",
      "is_active"
    ],
    properties: {
      units_short_name: { type: "string" },
      units_long_name: { type: "string" },
      is_active: { type: "boolean" },
      company_id: { type: "integer" }
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

module.exports = putUnitSchema;
