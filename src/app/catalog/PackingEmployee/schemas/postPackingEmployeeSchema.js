const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postPackingEmployeeSchema = {
  tags: ["PackingEmployeeS"],
  summary: "This API is to post PackingEmployees",
  headers: { $ref: "request-headers#" },
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

module.exports = postPackingEmployeeSchema;
