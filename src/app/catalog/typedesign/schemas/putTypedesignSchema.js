const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putConsumerSchema = {
  tags: [""],
  summary: "This API is to update Consumer",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      typedesign_id: { type: "integer" }
    }
  },
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
        success: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = putConsumerSchema;
