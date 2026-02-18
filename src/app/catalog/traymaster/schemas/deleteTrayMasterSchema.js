const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteTrayMasterSchema = {
  tags: ["TRAY MASTER"],
  summary: "This API is to delete tray master",
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
        success: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = deleteTrayMasterSchema;
