const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteUnitSchema = {
  tags: ["UNITS"],
  summary: "This API is to delete units",
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
        success: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = deleteUnitSchema;
