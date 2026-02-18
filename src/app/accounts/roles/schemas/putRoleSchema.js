const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putAddressSchema = {
  tags: ["ROLES"],
  summary: "This API is to update roles",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      role_id: { type: "integer" },
      company_id: { type: "integer" }
    }
  },
  body: {
    type: "object",
    required: ["role_name", "company_id", "warehouse_type"],
    properties: {
      role_name: {
        type: "string",
        // minLength: 2,
        // maxLength: 50,
        // pattern: "^[A-Za-z0-9 ]+$",
        // errorMessage: "Invalid role_name. Only letters, numbers, and spaces are allowed. Length should be between 3 and 50 characters."
      },
      company_id: {
        type: "integer",
        // minimum: 1,
        // errorMessage: "Invalid company_id. Must be a positive integer."
      },
      warehouse_type: {
        type: "integer",
        enum: [0, 1, 2],
        errorMessage: "Invalid warehouse_type. Allowed values are 0, 1, or 2."
      }
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

module.exports = putAddressSchema;
