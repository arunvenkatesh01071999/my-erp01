const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getPickerMasterSchema = {
  tags: ["PICKERMASTER"],
  summary: "This API is to get picker master",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          picker_name: { type: "string" },
          password: { type: "string" },
          today_work_status: { type: "integer" },
          company_id: { type: "integer" },
          is_active: { type: "boolean" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getPickerMasterSchema;
