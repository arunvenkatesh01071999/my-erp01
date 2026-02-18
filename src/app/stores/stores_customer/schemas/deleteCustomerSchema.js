const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteCustomerSchema = {
  tags: ["CUSTOMER"],
  summary: "This API is to delete customer",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      customer_id: { type: "integer" }
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

module.exports = deleteCustomerSchema;
