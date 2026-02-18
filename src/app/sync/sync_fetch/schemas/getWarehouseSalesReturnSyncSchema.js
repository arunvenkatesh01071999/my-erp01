const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getWarehouseSalesReturnSchema = {
  tags: ["Warehouse Sales Return"],
  summary: "Get warehouse sales return list",
  headers: { $ref: "request-headers#" },

  params: {
    type: "object",
    required: ["warehouse_id"],
    properties: {
      warehouse_id: { type: "integer" }
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
          docno: { type: "string" },
          docdate: { type: "string", format: "date" },

          customer_type: { type: "integer" },
          customer_id: { type: "integer" },

          total_amount: { type: "string" },
          discount: { type: "string" },
          grand_total: { type: "string" },
          temp_grand_total: { type: "string" },
          roff: { type: "string" },
          paid: { type: "string" },

          sales_type: { type: "integer" },
          status: { type: "integer" },
          return_amount: { type: "string" },

          company_id: { type: "integer" },

          po_no: { type: "string" },
          po_date: { type: "string", format: "date" },

          lr_no: { type: "string" },
          lr_date: { type: "string", format: "date" },

          transport: { type: "string" },
          delivery_by: { type: "string" },

          pg_total: { type: "string" },
          other_charges: { type: "string" },

          total_gst_amount: { type: "string" },
          total_igst_amount: { type: "string" },

          advance: { type: "string" },
          cess_amt: { type: "string" },

          deleted_status: { type: "integer" },
          remark: { type: "string" },

          export_pending: { type: "integer" },
          delivery_date: { type: "string", format: "date" },

          perfix: { type: "string" },
          auto_gen_id: { type: "integer" },
          mail_id: { type: "integer" },
          indent_id: { type: "integer" },

          exp_user_id: { type: "integer" },
          exp_date: { type: "string", format: "date" },

          msuid: { type: "integer" },
          msdocid: { type: "integer" },
          msdate: { type: "string", format: "date" },

          mobile_export: { type: "integer" },
          einvoice: { type: "integer" },

          akno: { type: "string" },
          ak_date: { type: "string", format: "date" },

          irnno: { type: "string" },

          verify: { type: "boolean" },
          verify_user_id: { type: "integer" },

          eway: { type: "string" },
          eway_no: { type: "string" },
          eway_date: { type: "string", format: "date" },
          eway_valid_date: { type: "string", format: "date" },

          eway_invoice_path: { type: "string" },
          eway_path: { type: "string" },

          export_pending_scheduling: { type: "string", format: "date" },

          is_sales_sync: { type: "boolean" },
          op_doc_no: { type: "string" },

          outlet_id: { type: ["integer", "null"] },
          outlet_full_name: { type: ["string", "null"] },
          outlet_short_name: { type: ["string", "null"] },

          warehouse_id: { type: "integer" },
          warehouse_full_name: { type: "string" },
          warehouse_short_name: { type: "string" },

          sales_lines: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "integer" },
                sales_master_id: { type: "integer" },
                financial_year: { type: "string" },
                docno: { type: "string" },
                docdate: { type: "string", format: "date" },

                prodid: { type: "integer" },
                pro_code: { type: "string" },

                category_id: { type: "integer" },
                uom_id: { type: "integer" },

                batch_no: { type: "string" },
                expiry_date: { type: "string", format: "date" },

                qty: { type: "string" },
                temp_sale_qty: { type: "string" },
                free_qty: { type: "string" },

                dis_per: { type: "string" },
                dis_amt: { type: "string" },

                rate: { type: "string" },
                amount: { type: "string" },

                company_id: { type: "integer" },

                prate: { type: "string" },
                pamount: { type: "string" },

                type_id: { type: "integer" },

                gst: { type: "string" },
                cgst: { type: "string" },
                sgst: { type: "string" },
                gst_amount: { type: "string" },

                igst: { type: "string" },
                igst_amount: { type: "string" },

                cess: { type: "string" },
                cess_amt: { type: "string" },

                gross_qty: { type: "integer" },
                pack_id: { type: "integer" },

                manufacture_date: { type: "string", format: "date" },

                expiry_id: { type: "integer" },
                expiry_value: { type: "integer" },

                mrp: { type: "string" },
                auto_batch: { type: ["string", "null"] },

                outlet_rate: { type: "string" },

                indent: { type: "integer" },
                indent_date: { type: "string", format: "date" },
                indent_qty: { type: "string" },

                alter_uom_id: { type: "integer" },
                alter_qty: { type: "string" },
                alter_contain: { type: "string" },
                alter_rate: { type: "string" },

                barcode: { type: "string" },

                picker_id: { type: "integer" },
                gross_alter_id: { type: "integer" },
                pro_name: { type: "string" },
                units_short_name: { type: "string" },
                head_name: { type: "string" },
                type_name: { type: "string" },
                category_name: { type: "string" },
                subcategory_name: { type: "string" }
              }
            }
          }
        }
      }
    }
  }
};

module.exports = { getWarehouseSalesReturnSchema };
