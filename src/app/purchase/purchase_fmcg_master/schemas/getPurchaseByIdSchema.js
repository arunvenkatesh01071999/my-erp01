const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getPurchaseByIdSchema = {
  tags: ["PURCHASE DETAILS BY ID"],
  summary: "API to get purchase details by id",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      purchase_id: { type: "integer" }
    },
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
          supplier_id: { type: "integer" },
          supplier_name: { type: "string" },
          short_name: { type: "string" },
          add1: { type: "string" },
          add2: { type: "string" },
          add3: { type: "string" },
          add4: { type: "string" },
          total_amount: { type: "number" },
          discount: { type: "number" },
          vatcst_amount: { type: "number" },
          grand_total: { type: "number" },
          invoice_no: { type: "string" },
          invoice_date: { type: "string" },
          roff: { type: "number" },
          paid: { type: "number" },
          status: { type: "integer" },
          return_amount: { type: "number" },
          company_id: { type: "integer" },
          other_charges: { type: "number" },
          gst: { type: "boolean" },
          igst: { type: "boolean" },
          advance: { type: "number" },
          cess_amt: { type: "number" },
          remark: { type: "string" },
          less_amt: { type: "number" },
          product_type: { type: "integer" },
          tcs: { type: "number" },
          dc_no: { type: "string" },
          closing_stock: { type: "number" },
          opening_stock: { type: "number" },
          purchase: { type: "number" },
          purchase_return: { type: "number" },
          sales: { type: "number" },
          sales_return: { type: "number" },
          debit_note: { type: "number" },
          profit: { type: "number" },
          percentage: { type: "number" },
          avg_agreed_margin: { type: "number" },
          avg_fil_rate: { type: "number" },
          tds_percentage: { type: "number" },
          tds_amount: { type: "number" },
          reason_debite_note: { type: "string" },
          reason_debite_note_amount: { type: "number" },
          debite_note_amount: { type: "number" },
          freight_charges: { type: "number" },
          wh_id: { type: "integer" },
          purchase_details_lines: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "integer" },
                purchase_master_id: { type: "integer" },
                financial_year: { type: "string" },
                docno: { type: "string" },
                docdate: { type: "string", format: "date" },
                prod_code: { type: "string" },
                pro_name: { type: "string" },
                head_id: { type: "integer" },
                type_id: { type: "integer" },
                subcat_id: { type: "integer" },
                cat_id: { type: "integer" },
                uom_id: { type: "integer" },
                unit_name: { type: "string" },
                qty: { type: "integer" },
                free_qty: { type: "integer" },
                discount: { type: "number" },
                discount_amount: { type: "number" },
                vat: { type: "number" },
                vat_amt: { type: "number" },
                purchase_rate: { type: "number" },
                cost_price: { type: "number" },
                gross_amount: { type: "number" },
                supplier_id: { type: "integer" },
                company_id: { type: "integer" },
                wh_id: { type: "integer" },
                po_no: { type: "string" },
                hsn: { type: "string" },
                mrp: { type: "number" },
                gst: { type: "number" },
                igst: { type: "number" },
                cgst: { type: "number" },
                sgst: { type: "number" },
                cess: { type: "number" },
                cess_amt: { type: "number" },
                po_qty: { type: "integer" },
                pack_flag: { type: "boolean" },
                pack_qty: { type: "integer" },
                accepted_margin: { type: "number" },
                purchase_margin: { type: "number" },
                sales_margin: { type: "number" },
                sale_rate: { type: "number" },
                batch_no: { type: "string" },
                expiry_date: { type: "string", format: "date" },
                reason_debit_note_amt: { type: "number" },
                reason_debite_note: { type: "string" },
                return_qty: { type: "integer" },
                purchase_batch_details: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      purchase_master_id: { type: "integer" },
                      product_id: { type: "integer" },
                      product_code: { type: "string" },
                      batch_no: { type: ["string", "number"] },
                      qty: { type: "number" },
                      self_life_qty: { type: "number" },
                      return_qty: { type: "number" }, // change from string
                      company_id: { type: "number" },
                      manufacture_date: { type: "string", format: "date" },
                      expiry_type: { type: "number" },
                      expiry_value: { type: "number" },
                      expiry_date: { type: "string", format: "date" }
                    }
                  }
                }
              }
            }
          },
          purchase_tray_details: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "integer" },
                purchase_master_id: { type: "integer" },
                docdate: { type: "string", format: "date" },
                tray_id: { type: "integer" },
                tray_count: { type: "integer" }
              }
            }
          },
          purchase_grn_details: {
            type: "object",
            properties: {
              pono: { type: "string" },
              invoice_no: { type: "string" },
              invoice_date: { type: "string", format: "date" },
              supplier_id: { type: "integer" },
              supplier_name: { type: "string" }
            }
          }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getPurchaseByIdSchema;
