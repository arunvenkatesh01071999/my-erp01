const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSalesMasterByIdSchema = {
  tags: ["SalesMaster"],
  summary: "This API is to get sales details by id",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      sale_id: { type: "integer" }
    },
    required: ["sale_id"]
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          docdate: { type: "string", format: "date" },
          docno: { type: "string" },
          customer_type: { type: "integer" },
          total_amount: { type: "number" },
          discount: { type: "number" },
          grand_total: { type: "number" },
          roff: { type: "number" },
          sales_type: { type: "integer" },
          company_id: { type: "integer" },
          po_no: { type: "string" },
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
          customer_id: {
            type: "object",
            properties: {
              id: { type: "integer" },
              customer_name: { type: "string" },
              add1: { type: ["string", "null"] },
              add2: { type: ["string", "null"] },
              gst_type: { type: "string" },
              customer_type: { type: "string" }
            }
          },
          sales_details_lines: {
            type: "array",
            items: {
              type: "object",
              properties: {
                product_id: { type: "integer" },
                product_code: { type: "string" },
                product_name: { type: "string" },
                main_catgory_id: { type: "integer" },
                main_category_name: { type: ["string", "null"] },
                uom_id: { type: "integer" },
                units_short_name: { type: "string" },
                batch_no: { type: "string" },
                expiry_date: { type: "string", format: "date" },
                qty: { type: "integer" },
                free_qty: { type: "integer" },
                discount_percentage: { type: "number" },
                discount_amount: { type: "number" },
                pur_rate: { type: "number" },
                outlet_rate: { type: "number" },
                amount: { type: "number" },
                mrp: { type: "number" },
                mrp_list: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      mrp: { type: "number" },
                    },
                  },
                },
                gst: { type: "number" },
                gst_amt: { type: "number" },
                cess: { type: "number" },
                cess_amt: { type: "number" },
                barcode: { type: "string" },
                manufacture_date: { type: "string", format: "date" },
                expiry_id: { type: "integer" },
                expiry_value: { type: "integer" },
                picker_id: { type: "integer" }
              }
            }
          },
          sales_tray_details: {
            type: "array",
            items: {
              type: "object",
              properties: {
                tray_id: { type: "integer" },
                tray_count: { type: "integer" }
              }
            }
          }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getSalesMasterByIdSchema;
