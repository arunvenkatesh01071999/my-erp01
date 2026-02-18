const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putHeadSchema = {
  tags: ["HEADS"],
  summary: "This API is to update Heads",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      head_id: { type: "integer" }
    }
  },
  body: {
    type: "object",
    required: ["cateogory_name", "company_id", "is_active"],
    properties: {
      cateogory_name: {
        type: "string",
        // pattern: "^[A-Za-z ]+$", // Allows only letters and spaces
        // errorMessage: "Cateogory name should contain only alphabets and spaces."
      },
      company_id: { type: "integer" },
      is_active: { type: "boolean" }
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

module.exports = putHeadSchema;
