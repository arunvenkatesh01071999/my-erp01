const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getPickerMasterInfoSchema = {
  tags: ["PICKER MASTER INFO"],
  summary: "This API is to get picker group master",
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
        id: { type: "integer" },
        picker_name: { type: "string" },
        password: { type: "string" },
        today_work_status: { type: "integer" },
        company_id: { type: "integer" },
        is_active: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getPickerMasterInfoSchema;
