const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSalesEditListSchema = {
  tags: ["GET SALES EDIT LIST"],
  summary: "get sales edit list",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          customer_name: { type: "string" },
          docdate: { type: "string", format: "date" }, // Corrected type
          gst: { type: "boolean" },
          igst: { type: "boolean" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getSalesEditListSchema;
