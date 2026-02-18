const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postTrayMasterSchema = {
  tags: ["TRAYMATSER"],
  summary: "This API is to post tray master",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["tray_name", "tray_weight", "company_id", "is_active"],
    properties: {
      tray_name: {
        type: "string",
        // errorMessage: "Tray name must be string."
      },
      tray_weight: { type: "number" },
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

module.exports = postTrayMasterSchema;
