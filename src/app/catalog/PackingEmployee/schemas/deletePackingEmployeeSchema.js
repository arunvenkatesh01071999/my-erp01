const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deletePackingEmployeeSchema = {
  tags: ["PackingEmployee"],
  summary: "This API is to delete units",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      id: { type: "integer" }
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

module.exports = deletePackingEmployeeSchema;
