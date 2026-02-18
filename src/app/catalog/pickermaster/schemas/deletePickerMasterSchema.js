const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deletePickerMasterSchema = {
  tags: ["PICKERMASTER"],
  summary: "This API is to delete picker master",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      pickermaster_id: { type: "integer" }
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

module.exports = deletePickerMasterSchema;
