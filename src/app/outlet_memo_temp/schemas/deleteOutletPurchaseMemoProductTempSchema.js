const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const deleteOutletPurchaseMemoTempSchema = {
  tags: ["OUTLET PURCHASE MEMO TEMP"],
  summary: "API to delete a single outlet purchase memo temp",
  headers: { $ref: "request-headers#" },

  params: {
    type: "object",
    properties: {
      pono: { type: "string" },
      product_id: { type: "integer" },
      outlet_id: { type: "integer" },
      supplier_id: { type: "integer" },
      batch_no: { type: "string" }
    },
    required: ["pono", "product_id", "outlet_id", "supplier_id", "batch_no"]
  },

  response: {
    200: {
      type: "object",
      required: ["success", "message"],
      properties: {
        success: { type: "boolean" },
        message: { type: "string" }

      }
    },

    ...errorSchemas
  }
};

module.exports = deleteOutletPurchaseMemoTempSchema;
