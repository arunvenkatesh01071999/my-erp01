const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getOutletPurchaseMemoProductTempSchema = {
  tags: ["OUTLET PURCHASE MEMO TEMP"],
  summary: "API to get purchase memo temp product details",
  headers: { $ref: "request-headers#" },

  params: {
    type: "object",
    properties: {
      product_id: { type: "number" },
      pono: { type: "string" },
      outlet_id: { type: "number" },
      supplier_id: { type: "number" }
    },
    required: ["product_id", "pono", "outlet_id", "supplier_id"]
  },

  response: {
    200: {
      type: "object",
      required: [
        "product_id",
        "product_code",
        "po_order_qty",
        "received_qty",
        "total_qty",
        "memo_mrp",
        "po_mrp",
        "uom_name",
        "memo_batch_details"
      ],
      properties: {
        product_id: { type: "number" },
        product_code: { type: "string" },
        po_order_qty: { type: ["string", "number"] },
        received_qty: { type: ["string", "number"] },
        free_qty: { type: ["string", "number"] },
        return_qty: { type: ["string", "number"] },
        total_qty: { type: ["string", "number"] },
        memo_mrp: { type: ["string", "number"] },
        po_mrp: { type: ["string", "number"] },
        product_name: {
          type: ["string", "null"]
        },
         uom_id: {
          type: "integer"
        },
        uom_name: {
          type: ["string", "null"]
        },
        memo_batch_details: {
                type: "array",
                items: {
                  type: "object",
                  required: [
                    "product_id",
                    "batch_no",
                    "qty",
                    "mrp"
                  ],
                  properties: {
                    product_id: { type: "number" },
                    batch_no: { type: "string" },
                    qty: { type: ["string", "number"] },
                    mrp: { type: ["string", "number"] },
                    free_qty: { type: ["string", "number"] },
                    return_qty: { type: ["string", "number"] },
                    expiry_type: { type: ["string", "number"] },
                    expiry_value: { type: ["string", "number"] },
                    expiry_date: {
                      type: ["string", "null"],
                      format: "date"
                    },
                    manufacture_date: {
                      type: ["string", "null"],
                      format: "date"
                    }
                  }
                }
              }
      }
       
    },

    ...errorSchemas
  }
};

module.exports = getOutletPurchaseMemoProductTempSchema;
