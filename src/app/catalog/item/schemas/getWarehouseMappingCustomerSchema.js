const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getWarehouseByCustomerSchema = {
  tags: ["OutletSales"],
  summary: "Get warehouse mapping customer",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array", // Since the response is an array
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          customer_id: { type: "integer" },
          customer_name: { type: "string" },
          warehouse_id: { type: "integer" }
        }
      },
      ...errorSchemas
    }
  }
};

module.exports = getWarehouseByCustomerSchema;
