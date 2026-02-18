const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSyncOutletPoDetailsSchema = {
  tags: ["SYNC OUTLET PO DETAILS"],
  summary: "API to list outlet purchase orders with details",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      outlet_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          financial_year: { type: "string" },
          po_no: { type: "string" },
          po_date: { type: "string" },
          outlet_id: { type: "integer" },
          supplier_id: { type: "integer" },
          approval: { type: "integer" },
          is_approved_by: { type: "integer" },
          un_approval_comments: { type: ["string", "null"] },
          total_items: { type: "integer" },
          total_order_qty: { type: "number" },
          sub_total_amt: { type: "number" },
          total_gst_amt: { type: "number" },
          total_igst_amt: { type: "number" },
          total_cess_amt: { type: "number" },
          roff: { type: "number" },
          grand_total_amt: { type: "number" },
          set_qty_flag: { type: "boolean" },
          expiry_date: { type: ["string", "null"] },
          expired: { type: "boolean" },
          company_id: { type: "integer" },
          po_type: { type: "string" },
          action_flag: { type: "boolean" },
          outlet_name: { type: "string" },
          supplier_name: { type: "string" },
          supplier_address1: { type: ["string", "null"] },
          supplier_address2: { type: ["string", "null"] },
          po_details_lines: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "integer" },
                outlet_po_master_id: { type: "integer" },
                financial_year: { type: "string" },
                po_no: { type: "string" },
                po_date: { type: "string" },
                outlet_id: { type: "integer" },
                outlet_name: { type: "string" },
                prod_code: { type: "integer" },
                prod_id: { type: "integer" },
                prod_name: { type: "string" },
                category_id: { type: "integer" },
                category_name: { type: "string" },
                supplier_id: { type: "integer" },
                sales_quantity: { type: "string" },
                stk_hold: { type: "string" },
                balance: { type: "string" },
                phy_qty: { type: ["string", "null"] },
                mrp: { type: "number" },
                cp: { type: ["string", "null"] },
                gst: { type: "string" },
                cgst: { type: "string" },
                sgst: { type: "string" },
                igst: { type: ["string", "null"] },
                gst_amount: { type: "number" },
                rate: { type: "number" },
                quantity: { type: "integer" },
                amount: { type: "string" },
                company_id: { type: "integer" },
                type: { type: "string" },
                mbq: { type: ["integer", "null"] },
                mbqdays: { type: ["integer", "null"] },
                sales_days: { type: ["string", "null"] },
                stock_days: { type: ["string", "null"] },
                min_mbq: { type: ["string", "null"] },
                t_qty: { type: ["string", "null"] },
                pack_qty: { type: ["string", "null"] },
                sys_qty: { type: ["string", "null"] },
                req_qty: { type: ["string", "null"] },
                ord_qty: { type: ["string", "null"] },
                sugg_qty: { type: ["string", "null"] },
                landing_rate: { type: ["string", "null"] },
                action_flag: { type: "boolean" }
              }
            }
          }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getSyncOutletPoDetailsSchema;
