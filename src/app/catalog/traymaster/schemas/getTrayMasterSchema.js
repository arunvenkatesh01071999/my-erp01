const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getTrayMasterSchema = {
  tags: ["TRAYMASTER"],
  summary: "This API is to get trya master",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          tray_name: { type: "string" },
          tray_weight: { type: "number" },
          company_id: { type: "integer" },
          is_active: { type: "boolean" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getTrayMasterSchema;
