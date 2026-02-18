const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postOutletPurchaseOrderSchema = {
  tags: ["Outlet PurchaseOrder"],
  summary: "This API is to post an Outlet Purchase Order",
  headers: { $ref: "request-headers#" },

  body: {
    type: "object",
    required: ["outlet_id", "outlet_name", "po_date", "supplier_id", "total_items", "outlet_po_details"],
    properties: {
      outlet_id: { type: "string" },
      outlet_name: { type: "string" },
      po_no: { type: "string" },
      po_date: { type: "string" },
      total_items: { type: "integer" },
      supplier_id: { type: "integer" },

      outlet_po_details: {
        type: "array",
        items: {
          type: "object",
          required: [
            "prod_code",
            "prod_id",
            "prod_name",
            "category_id",
            "category_name",
            "stk_hold",
            "balance",
            "phy_qty",
            "mrp",
            "gst",
            "gst_amount",
            "rate", "cgst", "sgst", "quantity", "amount", "pack_qty",
            "ord_qty", "req_qty", "sugg_qty", "min_mbq", "t_qty",
            "sales_days", "Totalbalance", "stockbalance", "MAXMBQ",
            "averageQty", "brand_company_id", "mbqdays", "ts", "vlt",
            "paway", "caseQty", "mbq",
            // new fields
            "cess", "uom_id", "sales_quantity", "fixedmargin",
            "vendordiscounttype", "vendordiscountvalue"
          ],
          properties: {
            prod_code: { type: "string" },
            prod_id: { type: "integer" },
            prod_name: { type: "string" },
            category_id: { type: "integer" },
            category_name: { type: "string" },
            stk_hold: { type: "number" },
            balance: { type: "number" },
            phy_qty: { type: "number" },
            mrp: { type: "number" },
            gst: { type: "string" },
            gst_amount: { type: "number" },
            rate: { type: "number" },
            cgst: { type: "number" },
            sgst: { type: "number" },
            quantity: { type: "number" },
            amount: { type: "string" },
            pack_qty: { type: "number" },
            ord_qty: { type: "number" },
            req_qty: { type: "number" },
            sugg_qty: { type: "number" },
            min_mbq: { type: "number" },
            t_qty: { type: "number" },
            sales_days: { type: "number" },
            Totalbalance: { type: "number" },
            stockbalance: { type: "number" },
            MAXMBQ: { type: "number" },
            averageQty: { type: "number" },
            brand_company_id: { type: "number" },
            mbqdays: { type: "number" },
            ts: { type: "number" },
            vlt: { type: "number" },
            paway: { type: "number" },
            caseQty: { type: "number" },
            mbq: { type: "number" },

            // Newly added fields
            cess: { type: "number" },
            uom_id: { type: "number" },
            sales_quantity: { type: "number" },
            fixedmargin: { type: "number" },
            vendordiscounttype: { type: "number" },
            vendordiscountvalue: { type: "number" }
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

module.exports = postOutletPurchaseOrderSchema;
