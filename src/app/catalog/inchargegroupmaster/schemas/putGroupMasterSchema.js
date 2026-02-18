const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putGroupMasterSchema = {
  tags: [""],
  summary: "This API is to update group master",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      inchargegroupmaster_id: { type: "integer" }
    }
  },
  body: {
    type: "object",
    required: ["group_name", "company_id", "is_active"],
    properties: {
      group_name: {
        type: "string",
        // pattern: "^[A-Za-z0-9 ]+$", // Allows letters, numbers, and spaces
        // errorMessage: "Group name should contain only alphabets, numbers, and spaces."
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

module.exports = putGroupMasterSchema;
