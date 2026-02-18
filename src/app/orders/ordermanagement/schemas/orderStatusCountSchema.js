const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const orderStatusCountSchema = {
  tags: ["ORDERS STATUS COUNT"],
  summary:
    "This API is to get orders For neworder-0,processing-1,invoice-2,transists-3,delivered-4,canceled-5",
  headers: { $ref: "request-headers#" },
  // body: {
  //   type: "object",
  //   additionalProperties: false,
  //   properties: {
  //     date: { type: "string", format: "date-time" }
  //   }
  // },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          status_name: { type: "string" },
          orders_status: { type: "string" },
          count: { type: "integer" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = orderStatusCountSchema;
