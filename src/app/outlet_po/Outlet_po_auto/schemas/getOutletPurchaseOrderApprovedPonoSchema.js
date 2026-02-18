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
          total_items: { type: "string" },
          set_qty_flag: { type: "boolean" },
          invoice_discount_amount: { type: "integer" },
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

                brand_company_id: { type: ["integer", "null"] },
                uom_id: { type: ["integer", "null"] },

                soh: { type: "integer" },
                balance: { type: "integer" },

                mrp: { type: "integer" },
                pur_rate: { type: "number" },
                cost_price: { type: "number" },
                margin: { type: "integer" },
                vendor_discount_type: { type: "integer" },
                vendor_discount_value: { type: "integer" },

                gst: { type: "integer" },
                cgst: { type: "integer" },
                sgst: { type: "integer" },
                cess: { type: "integer" },
                gst_amount: { type: "number" },
                landing_price: { type: "number" },
                orderQty: { type: "integer" },
                amount: { type: "number" },

                min_mbq: { type: "integer" },
                PackQty: { type: "integer" },
                Transit_Qty: { type: "integer" },
                suggested_Qty: { type: "integer" },
                RequiredQty: { type: "integer" },
                sales_qty: { type: "integer" },
                purchase_order_type: { type: "string" },

                averageQty: { type: "integer" },

                Daily_Run_Rate: { type: "integer" },
                sales_days: { type: "integer" },

                stockbalance: { type: "integer" },
                Totalbalance: { type: "integer" },

                finalPackQty: { type: "integer" },
                finalMBQ: { type: "integer" },

                caseQty: { type: ["number"] },

                ts: { type: "integer" },
                vlt: { type: "integer" },
                paway: { type: "integer" },

                mbq: { type: "integer" },
                phy_qty: { type: "integer" }

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
