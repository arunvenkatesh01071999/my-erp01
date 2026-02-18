const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteSupplierSchema = {
  tags: ["SUPPLIER"],
  summary: "This API is to delete SUPPLIER",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      supplier_id: { type: "integer" }
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

module.exports = deleteSupplierSchema;
