const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteItemSchema = {
  tags: ["Item"],
  summary: "This API is to  Item Barcode",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      barcode: { type: "string" }
    },
    required: ["barcode"]
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          prod_id: { type: "integer" },
          barcode: { type: "string" },
          is_sold: { type: "boolean" },
          is_active: { type: "boolean" },
          company_id: { type: "integer" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
          created_by: { type: "integer" },
          updated_by: { type: "integer" },
          purchase_no: { type: "string" },
          outlet_id: { type: "integer" }
        },

      }
    },
    ...errorSchemas
  }
};

module.exports = deleteItemSchema;
