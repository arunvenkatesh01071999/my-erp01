const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteConsumerSchema = {
  tags: ["WAREHOUSE"],
  summary: "This API is to delete WareHouse",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      warehouse_id: { type: "integer" }
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

module.exports = deleteConsumerSchema;
