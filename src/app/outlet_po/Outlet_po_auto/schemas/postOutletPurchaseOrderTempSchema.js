const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postOutletPurchaseOrderTempSchema = {
  tags: ["Outlet PurchaseOrder"],
  summary: "This API is to post an Outlet Purchase Order",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: [
      "outlet_id",
      "outlet_name",
      "total_items",
      "outlet_po_details",
      "brand_company_id"
    ],
    properties: {
      outlet_id: {
        type: "integer",
        errorMessage: "outlet_id must be an integer"
      },
      brand_company_id: {
        type: "integer",
        errorMessage: "brand_company_id must be an integer"
      },

      outlet_name: {
        type: "string",
        errorMessage: "outlet_name must be a string"
      },
      po_no: { type: "string", errorMessage: "po_no must be a string" },
      po_date: {
        type: "string",
        format: "date",
        errorMessage: "po_date must be a valid date in YYYY-MM-DD format"
      },
      prod_name: { type: "string", errorMessage: "prod_name must be a string" },
      category_id: {
        type: "integer",
        errorMessage: "category_id must be an integer"
      },
      category_name: {
        type: "string",
        errorMessage: "category_name must be a string"
      },
      sales_quantity: {
        type: "number",
        errorMessage: "sales_quantity must be an integer"
      },
      stk_hold: {
        type: "integer",
        errorMessage: "stk_hold must be an integer"
      },
      balance: { type: "integer", errorMessage: "balance must be an integer" },
      phy_qty: { type: "integer", errorMessage: "phy_qty must be an integer" },
      mrp: { type: "number", errorMessage: "mrp must be a number" },
      cp: { type: "number", errorMessage: "cp must be a number" },
      gst: { type: "number", errorMessage: "gst must be a number" },
      gst_amount: {
        type: "number",
        errorMessage: "gst_amount must be a number"
      },
      rate: { type: "number", errorMessage: "rate must be a number" },
      quantity: {
        type: "integer",
        errorMessage: "quantity must be an integer"
      },
      amount: { type: "number", errorMessage: "amount must be a number" },
      prod_code: { type: "string", errorMessage: "prod_code must be a string" },
      prod_id: { type: "integer", errorMessage: "prod_id must be an integer" },
      total_items: {
        type: "integer",
        errorMessage: "total_items must be an integer"
      },
      total_order_qty: {
        type: "integer",
        errorMessage: "total_order_qty must be an integer"
      },
      sub_total_amt: {
        type: "number",
        errorMessage: "sub_total_amt must be a number"
      },
      total_gst_amt: {
        type: "number",
        errorMessage: "total_gst_amt must be a number"
      },
      total_igst_amt: {
        type: "number",
        errorMessage: "total_igst_amt must be a number"
      },
      total_cess_amt: {
        type: "number",
        errorMessage: "total_cess_amt must be a number"
      },
      roff: { type: "number", errorMessage: "roff must be a number" },
      grand_total_amt: {
        type: "number",
        errorMessage: "grand_total_amt must be a number"
      },
      expired: { type: "boolean", errorMessage: "expired must be a boolean" },
      is_approved_by: {
        type: "string",
        errorMessage: "is_approved_by must be a string"
      },
      un_approval_comments: {
        type: "string",
        errorMessage: "un_approval_comments must be a string"
      },
      set_qty_flag: {
        type: "boolean",
        errorMessage: "set_qty_flag must be Boolean"
      },

      // Outlet PO Details
      outlet_po_details: {
        type: "array",
        items: {
          type: "object",
          required: [
            // "prod_code",
            // "prod_id",
            // "prod_name",
            // "category_id",
            // "category_name",
            // "sales_quantity",
            // "stk_hold",
            // "balance",
            // "phy_qty",
            // "mrp",
            // "cp",
            // "gst",
            // "gst_amount",
            // "rate",
            // "quantity",
            // "amount"
          ],
          properties: {
            prod_code: {
              type: "string",
              errorMessage: "prod_code must be a string"
            },
            prod_id: {
              type: "integer",
              errorMessage: "prod_id must be an integer"
            },
            prod_name: {
              type: "string",
              errorMessage: "prod_name must be a string"
            },
            category_id: {
              type: "integer",
              errorMessage: "category_id must be an integer"
            },
            category_name: {
              type: "string",
              errorMessage: "category_name must be a string"
            },
            sales_quantity: {
              type: "integer",
              errorMessage: "sales_quantity must be an integer"
            },
            stk_hold: {
              type: "integer",
              errorMessage: "stk_hold must be an integer"
            },
            balance: {
              type: "integer",
              errorMessage: "balance must be an integer"
            },
            phy_qty: {
              type: "integer",
              errorMessage: "phy_qty must be an integer"
            },
            mrp: { type: "number", errorMessage: "mrp must be a number" },
            cp: { type: "number", errorMessage: "cp must be a number" },
            gst: { type: "number", errorMessage: "gst must be a number" },
            gst_amount: {
              type: "number",
              errorMessage: "gst_amount must be a number"
            },
            rate: { type: "number", errorMessage: "rate must be a number" },
            quantity: {
              type: "integer",
              errorMessage: "quantity must be an integer"
            },
            amount: { type: "number", errorMessage: "amount must be a number" },
            fixedmargin: { type: "number", errorMessage: "fixed margin must be a number" },
            vendordiscounttype: {
              type: "integer",
              enum: [0, 1],
              errorMessage: {
                type: "Vendor discount type must be an integer",
                enum: "Vendor discount type must be either 0 or 1"
              }
            },
            vendordiscountvalue: { type: "number", errorMessage: "vendor discount value must be a number" }

          }
        }
      }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        outlet_po_master_id: { type: "integer" }
      }
    },
    ...errorSchemas
  }
};

module.exports = postOutletPurchaseOrderTempSchema;
