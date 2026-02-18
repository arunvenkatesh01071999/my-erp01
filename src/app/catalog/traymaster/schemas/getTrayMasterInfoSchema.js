const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getTrayMasterInfoSchema = {
  tags: ["INCHAGE MASTER INFO"],
  summary: "This API is to get tray master",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      traymaster_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        tray_name: { type: "string" },
        tray_weight: { type: "number" },
        company_id: { type: "integer" },
        is_active: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getTrayMasterInfoSchema;
