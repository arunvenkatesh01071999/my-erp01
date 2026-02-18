const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postConsumerSchema = {
  tags: ["TYPEDESIGN"],
  summary: "This API is to post Consumer",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["type_name", "company_id", "is_active"],
    properties: {
      type_name: {
        type: "string",
        // pattern: "^[A-Za-z ]+$", // Allows only letters and spaces
        // errorMessage: "Type name should contain only alphabets and spaces."
      },
      is_active: { type: "boolean" },
      company_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        insert_id: { type: "integer" }
      }
    },
    ...errorSchemas
  }
};

module.exports = postConsumerSchema;
