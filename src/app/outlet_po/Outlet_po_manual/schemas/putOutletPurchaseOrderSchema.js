const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putOutletPurchaseOrderSchema = {
  tags: ["Outlet Purchase Order Update"],
  summary: "API to update unapproved outlet purchase orders",
  headers: { $ref: "request-headers#" },

  params: {
    type: "object",
    required: ["company_id", "outlet_id", "po_no"],
    properties: {
      company_id: { type: "integer" },
      outlet_id: { type: "integer" },
      po_no: { type: "string" }
    }
  },

  body: {
    type: "object",
    required: ["outlet_id", "po_no", "po_date", "supplier_id", "outlet_po_details"],
    properties: {
      outlet_id: { type: "string" },
      outlet_name: { type: "string" },

      po_no: { type: "string" },
      po_date: { type: "string", description: "Date format: YYYY-MM-DD" },

      expiry_date: { type: "string" },

      total_items: { type: "number" },
      expired: { type: "boolean" },

      supplier_id: { type: "integer" },
      set_qty_flag: { type: "boolean" },
      invoice_discount_amount: { type: "string" },

      outlet_po_details: {
        type: "array",
        items: {
          type: "object",
          required: [
            "prod_code",
            "prod_id",
            "prod_name",
            "category_id",
            "sales_quantity",
            "gst",
            "rate",
            "quantity"
          ],
          properties: {
            prod_code: { type: "string" },
            prod_id: { type: "integer" },
            prod_name: { type: "string" },

            category_id: { type: "integer" },
            category_name: { type: "string" },

            sales_quantity: { type: "number" },
            stk_hold: { type: "string" },
            balance: { type: "string" },

            mrp: { type: "string" },
            cp: { type: "string" },

            gst: { type: "string" },
            gst_amount: { type: "number" },

            rate: { type: "string" },
            cgst: { type: "number" },
            sgst: { type: "number" },

            quantity: { type: "string" },
            amount: { type: "number" },
            approval: { type: "boolean" }
          }
        }
      }
    }
  },

  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = putOutletPurchaseOrderSchema;
