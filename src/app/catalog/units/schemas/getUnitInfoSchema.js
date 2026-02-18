const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getUnitInfoSchema = {
  tags: ["UNITS"],
  summary: "This API is to get units",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      unit_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        units_short_name: { type: "string" },
        units_long_name: { type: "string" },
        is_active: { type: "boolean" },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getUnitInfoSchema;
