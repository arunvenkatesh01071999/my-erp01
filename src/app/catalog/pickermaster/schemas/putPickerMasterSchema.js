const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putInchargeMasterSchema = {
  tags: [""],
  summary: "This API is to update incharge master",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      pickermaster_id: { type: "integer" }
    }
  },
  body: {
    type: "object",
    required: ["picker_name", "password", "today_work_status", "company_id", "is_active"],
    properties: {
      picker_name: {
        type: "string",
        // pattern: "^[A-Za-z ]+$", // Allows only letters and spaces
        // errorMessage: "Picker name should contain only alphabets and spaces."
      },
      password: {
        type: "string",
        // pattern: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@#$%^&+=!]{6,}$", // At least 6 characters, with letters & numbers
        // errorMessage: "Password must be at least 6 characters long and contain at least one letter and one number."
      },
      today_work_status: {
        type: "integer",
        enum: [0, 1, 2], // Restrict to only 0, 1, or 2 0-not_woking,1- working, 2-on_hold
        errorMessage: "Work status should be one of the values: 0, 1, or 2."
      },
      is_active: { type: "boolean" },
      company_id: { type: "integer" },
      incharge_group_id: { type: "integer" }
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

module.exports = putInchargeMasterSchema;
