const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postSalesMasterSchema = {
  tags: ["SalesMaster"],
  summary: "This API is to post SalesMaster",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["docdate", "customer_id", "total_amount", "company_id"],
    properties: {
      docdate: { type: "string", format: "date" },
      customer_id: { type: "integer" },
      customer_type: {
        anyOf: [
          { type: "number" },
          { type: "string" }
        ]
      },// igst= 1 and gst= 2
      total_amount: { type: "number" },
      discount_amount: { type: "number" },
      grand_total: { type: "number" },
      roff: { type: "number" },
      sale_type: { type: "integer" }, //1- Sales, 2-Transfer
      company_id: { type: "integer" },
      pono: { type: "string" },
      podate: { type: "string", format: "date" },
      lr_no: { type: "string" },
      lr_date: { type: "string", format: "date" },
      transport: { type: "string" },
      delivery_by: { type: "string" },
      other_charges: { type: "number" },
      gst: { type: "number" },
      cess_amt: { type: "number" },
      remark: { type: "string" },
      delivery_date: { type: "string", format: "date" },
      perfix: { type: "string" },
      indent_id: { type: "integer" },
      wh_id: { type: "integer" },
      sales_fmcg_details: {
        type: "array",
        items: {
          type: "object",
          required: ["product_id", "qty", "rate", "amount"],
          properties: {
            product_id: { type: "integer" },
            product_code: { type: "string" },
            category_id: { type: "integer" },
            uom_id: { type: "integer" },
            expiry_date: { type: "string", format: "date" },
            qty: { type: "number" },
            free_qty: { type: "number" },
            discount_percentage: { type: "number" },
            discount_amount: { type: "number" },
            rate: { type: "number" },
            outlet_rate: { type: "number" },
            amount: { type: "number" },
            mrp: { type: "number" },
            gst: { type: "number" },
            gst_amt: { type: "number" },
            cess: { type: "number" },
            cess_amt: { type: "number" },
            manufacture_date: { type: "string", format: "date" },
            expiry_id: { type: "integer" },
            expiry_value: { type: "number" },
            picker_id: { type: "integer" }
          }
        }
      },
      sales_tray_details: {
        type: "array",
        items: {
          type: "object",
          required: ["tray_id", "tray_count"],
          properties: {
            tray_id: { type: "integer" },
            tray_count: { type: "integer" }
          }
        }
      },
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        docno: { type: "string" }
      }
    },
    ...errorSchemas
  }
};

module.exports = postSalesMasterSchema;
