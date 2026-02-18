const { errorSchemas } = require("../../../commons/schemas/errorSchemas");


const getPoSyncPaginateSchema = {
  tags: ["SYNCPO"],
  summary: "This API gets sync PO master + details with pagination",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    required: ["flag", "outlet_id"],
    properties: {
      flag: { type: "integer" },
      outlet_id: { type: "integer" }
    }
  },

  response: {
    200: {
      type: "object",
      properties: {
        po_no: { type: "string" },

        master: {
          type: "object",
          properties: {
            po_no: { type: "string" },
            po_date: { type: "string" },
            outlet_id: { type: "integer" },
            supplier_customer_code: { type: "string" },
            grand_total_amt: { type: "number" },
            po_sync: { type: "integer" },
            down_time: { type: "string" },
            outlet_po_no: { type: "string" }
          }
        },

        details: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              outlet_po_master_id: { type: "integer" },
              outlet_id: { type: "integer" },
              outlet_name: { type: "string" },
              financial_year: { type: "string" },
              po_no: { type: "string" },
              po_date: { type: "string" },
              prod_code: { type: "string" },
              prod_id: { type: "integer" },
              prod_name: { type: "string" },
              supplier_id: { type: "integer" },
              category_id: { type: "integer" },
              category_name: { type: "string" },
              sales_quantity: { type: "number" },
              stk_hold: { type: "number" },
              balance: { type: "number" },
              phy_qty: { type: "number" },
              mrp: { type: "number" },
              cp: { type: "number" },
              gst: { type: "number" },
              igst: { type: "number" },
              cgst: { type: "number" },
              sgst: { type: "number" },
              gst_amount: { type: "number" },
              rate: { type: "number" },
              quantity: { type: "number" },
              amount: { type: "number" },
              company_id: { type: "integer" },
              created_by: { type: "integer" },
              updated_by: { type: "integer" },
              created_at: { type: "string" },
              updated_at: { type: "string" },
              type: { type: "string" },
              mbq: { type: "number" },
              mbqdays: { type: "number" },
              pack_qty: { type: "number" },
              sys_qty: { type: "number" },
              sales_qty: { type: "number" },
              req_qty: { type: "number" },
              ord_qty: { type: "number" },
              sugg_qty: { type: "number" },
              min_mbq: { type: "number" },
              t_qty: { type: "number" },
              sales_days: { type: "number" },
              stock_days: { type: "number" },
              landing_rate: { type: "number" },
              fixedmargin: { type: "number" },
              vendordiscounttype: { type: "string" },
              vendordiscountvalue: { type: "number" },
              average_qty: { type: "number" },
              stock_balance: { type: "number" },
              total_balance: { type: "number" },
              final_mbq: { type: "number" },
              brand_company_id: { type: "integer" }
            }
          }
        },

      }
    },

    ...errorSchemas
  }
};

module.exports = getPoSyncPaginateSchema;
