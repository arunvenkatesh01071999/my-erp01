const { format } = require("mysql");
const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getOutletPurchaseOrderApprovedPonoSchema = {
  tags: ["Item"],
  summary: "API to list approved PO with outlet, region, supplier & items",
  headers: { $ref: "request-headers#" },

  params: {
    type: "object",
    properties: {
      po_no: { type: "string" },
      company_id: { type: "integer" },
      outlet_id: { type: "integer" }
    }
  },

  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          outlet: {
            type: "object",
            additionalProperties: true
          },

          region: {
            type: "object",
            additionalProperties: true
          },

          supplier_id: {
            type: "object",
            additionalProperties: true
          },

          po_no: { type: "string" },

          po_date: { type: "string", format: "date" },
          expiry_date: { type: "string", format: "date" },
          total_items: { type: "integer" },
          set_qty_flag: { type: "boolean" },
          invoice_discount_amount: { type: "number" },
          memo_invoice_url: { type: "string" },
          invoice_no: { type: "string" },
          invoice_date: { type: "string" },
          po_details_lines: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "integer" },
                pro_code: { type: "string" },
                pro_name: { type: "string" },

                main_catgory_id: { type: "integer" },
                main_category_name: { type: "string" },

                po_type_id: { type: "integer" },

                brand_company_id: { type: "integer" },
                uom_id: { type: "integer" },

                mrp: { type: "number" },
                margin: { type: "integer" },
                vendor_discount_type: { type: "integer" },
                vendor_discount_value: { type: "integer" },
                cost_price: { type: "number" },
                pur_rate: { type: "number" },

                memo_mrp: { type: "number" },
                memo_cost_price: { type: "number" },
                gst: { type: "integer" },
                cgst: { type: "integer" },
                sgst: { type: "integer" },
                gst_amount: { type: "number" },
                memo_purchase_rate: { type: "number" },
                cess: { type: "integer" },
              
        
                qty: { type: "number" },
                landing_price: { type: "number" },
                amount: { type: "number" },

                sales_qty: { type: "integer" },
         

                soh: { type: "integer" },
                balance: { type: "integer" },

                min_mbq: { type: "integer" },
                PackQty: { type: "integer" },
                Transit_Qty: { type: "integer" },
                suggested_Qty: { type: "integer" },
                RequiredQty: { type: "integer" },
                orderQty: { type: "integer" },
                purchase_order_type: { type: "string" },
            
                averageQty: { type: "integer" },
       

                Daily_Run_Rate: { type: "number" },
                sales_days: { type: "integer" },

                stockbalance: { type: "integer" },
                Totalbalance: { type: "integer" },

                finalPackQty: { type: "integer" },
                finalMBQ: { type: "integer" },

                caseQty: { type: "number" },

                ts: { type: "number" },
                vlt: { type: "number" },
                paway: { type: "number" },

                mbq: { type: "integer" },
                phy_qty: { type: "integer" },
                approval: { type: "boolean" },
                grn_approval_status: { type: "integer" },
                grn_approved_by: { type: "integer" }
              },
              additionalProperties: false
            }
          }
        },
        additionalProperties: false
      }
    },
    ...errorSchemas
  }
};

module.exports = getOutletPurchaseOrderApprovedPonoSchema;
