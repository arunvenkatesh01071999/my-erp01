const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putExportPendingSchema = {
  tags: ["PUT EXPORT DETAILS"],
  summary: "This put export details to get all information",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      sale_id: { type: "integer" },
    }
  },
  body: {
    type: "object",
    properties: {
      status: { type: "integer" },
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" }
      },
    },
    ...errorSchemas,
  },
};

module.exports = putExportPendingSchema;
