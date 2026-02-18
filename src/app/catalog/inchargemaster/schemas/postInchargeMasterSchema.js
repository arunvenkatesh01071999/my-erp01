const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postInchargeMasterSchema = {
  tags: ["INCHARGEMATSER"],
  summary: "This API is to post incharge master",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["incharge_name", "incharge_group_id", "company_id", "is_active"],
    properties: {
      incharge_name: {
        type: "string",
        // pattern: "^[A-Za-z0-9 ]+$", // Allows letters, numbers, and spaces
        // errorMessage: "Incharge name should contain only alphabets, numbers, and spaces."
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

module.exports = postInchargeMasterSchema;
