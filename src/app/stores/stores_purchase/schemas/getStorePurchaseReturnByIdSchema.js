const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getStorePurchaseReturnByIdSchema = {
  tags: ["GET PURCHASE RETURN BY ID DETAILS"],
  summary: "API to list purchase order",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      purchase_return_id: { type: "integer" }
    },
    required: ["purchase_return_id"]
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          invoice_no: { type: "string" },
          invoice_date: { type: "string", format: "date-time" },
          purchase_master_id: { type: "integer" },
          type_id: { type: "integer" },
          remark: { type: "string" },
          outlet_id: { type: "integer" },
          outlet_name: { type: "string" },
          supplier_id: { type: "integer" },
          supplier_name: { type: "string" },
          
          short_name: { type: "string" },
          add1: { type: "string" },
          add2: { type: "string" },
          add3: { type: "string" },
          add4: { type: "string" },
          gst: { type: "boolean" },
          igst: { type: "boolean" },
          purchase_return_details_lines: {
            type: "array",
            items: {
              type: "object",
              properties: {
                product_id: { type: "integer" },
                product_code: { type: "string" },
                product_name: { type: "string" },
                batch_no: { type: "string" },
                expiry_date: { type: "string", format: "date-time" },
                accepted_qty: { type: "number" },
                return_qty: { type: "number" },
                accepted_free_qty: { type: "number" },
                return_free_qty: { type: "number" },
                uom_id: { type: "integer" },
                unit_name: { type: "string" },
                balance: { type: "number" },
                mrp: { type: "number" },
                purchase_rate: { type: "number" },
                discount_percentage: { type: "number" },
                discount_amount: { type: "number" },
                gst: { type: "number" },
                gst_amount: { type: "number" },
                igst: { type: "number" },
                igst_amount: { type: "number" },
                cess: { type: "number" },
                cess_amount: { type: "number" },
                amount: { type: "number" },
                reason: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    reason_name: { type: "string" },
                    company_id: { type: "integer" },
                    is_active: { type: "boolean" }
                  }
                }
              }
            }
          }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getStorePurchaseReturnByIdSchema;
