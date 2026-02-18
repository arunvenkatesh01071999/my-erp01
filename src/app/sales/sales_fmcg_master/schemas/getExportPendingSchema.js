const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getExportPendingSchema = {
  tags: ["EXPORT DETAILS"],
  summary: "This export details to get all information",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          customer_id: { type: "integer" },
          customer_name: { type: "string" },
          bill_no: { type: "integer" },
          docdate: { type: "string", format: "date" },
          delivery_date: { type: "string", format: "date" },
          export_pending: { type: "number" },

        },
      },
    },
    ...errorSchemas,
  },
};

module.exports = getExportPendingSchema;
