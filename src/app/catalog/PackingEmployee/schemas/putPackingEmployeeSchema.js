const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putPackingEmployeeSchema = {
  tags: ["Group"],
  summary: "This API is to update groups",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      id: { type: "integer" }
    }
  },
  body: {
    type: "object",
    required: [
      "name",
      "city",
      "mobile_number",
      "is_active"
    ],
    properties: {
      name: { type: "string" },
      city: { type: "string" },
      mobile_number: { type: "string" },
      is_active: { type: "boolean" },
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

module.exports = putPackingEmployeeSchema;
