const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getPurchase = {
  tags: ["Item INFO"],
  summary: "This API is to get Item Info",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      supplier_id: { type: "integer" },
      type_id: { type: "integer" }
    },
    required: ["supplier_id", "type_id"]
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          product_id: { type: "integer" },
          pro_code: { type: "string" },
          balance: { type: "number" },
          pro_name: { type: "string" },
          unit_name: { type: "string" },
          uom_id: { type: "integer" },
          mrp: { type: "string" }, // ✔️ Because in response, it's a string ("210.00")
          purchase_rate: { type: "string" },
          gst: { type: "string" },
          discount: { type: "string" },
          cess: { type: "string" },
          batch_no: { type: "integer" },
          expiry_date: { type: "string", format: "date-time" },
          return_qty: { type: "number" },
          gst_amount: { type: "number" },
          discount_amount: { type: "number" },
          igst: { type: "number" },
          igst_amount: { type: "number" },
          cess_amount: { type: "number" },
          reason: { type: "string" },
          amount: { type: "number" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getPurchase;
