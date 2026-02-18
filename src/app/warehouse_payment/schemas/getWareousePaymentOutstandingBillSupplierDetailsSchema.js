const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getWareousePaymentOutstandingBillSupplierDetailsSchema = {
  tags: ["HEADS"],
  summary: "This API is to get Outstanding Suppliers",
  headers: { $ref: "request-headers#" },

  params: {
    type: "object",
    required: ["supplier_id"],
    additionalProperties: false,
    properties: {
      supplier_id: { type: "integer" }
    }
  },

  response: {
    200: {
      type: "object",
      properties: {
        supplier_id: { type: "integer" },
        supplier_name: { type: "string" },
        supplier_address: { type: "string" },
        supplier_gstin: { type: "string" },
        supplier_balance: { type: "number" }
      },
      required: [
        "supplier_id",
        "supplier_name",
        "supplier_address",
        "supplier_gstin",
        "supplier_balance"
      ]
    }
  },

  ...errorSchemas
};

module.exports = getWareousePaymentOutstandingBillSupplierDetailsSchema;
