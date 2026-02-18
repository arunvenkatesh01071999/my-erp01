const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getPurchaseGrnByIdSchema = {
  tags: ["PURCHASE GRN BY ID"],
  summary: "API to get purchase GRN details by ID",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      grn_id: { type: "integer" }
    },
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          docno: { type: "string" },
          docdate: { type: "string" },
          pono: { type: "string" },
          invoice_no: { type: "string" },
          invoice_date: { type: "string", format: "date-time" },
          warehouse_id: { type: "integer" },
          supplier_id: { type: "integer" },
          supplier_name: { type: "string" },
          short_name: { type: "string" },
          remark: { type: "string" },
          add1: { type: "string" },
          add2: { type: "string" },
          add3: { type: "string" },
          add4: { type: "string" },
          supplier_gstin: { type: "string" },
          company_gstin: { type: "string" },
          gst: { type: "boolean" },
          igst: { type: "boolean" },
          grn_details_lines: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "integer" },
                purchase_grn_mst_id: { type: "integer" },
                docdate: { type: "string" },
                po_no: { type: "string" },
                prod_id: { type: "integer" },
                pro_code: { type: "string" },
                hsn: { type: "string" },
                unit_name: { type: "string" },
                pro_name: { type: "string" },
                cat_id: { type: "integer" },
                sub_cat_id: { type: "integer" },
                head_id: { type: "integer" },
                type_design_id: { type: "integer" },
                uom_id: { type: "integer" },
                barcode: { type: "string" },
                order_qty: { type: "string" },
                qty: { type: "string" },
                return_qty: { type: "integer" },
                purchase_rate: { type: "string" },
                sale_rate: { type: "string" },
                free_qty: { type: "string" },
                mrp: { type: "string" },
                gst: { type: "string" },
                igst: { type: "string" },
                igst_amount: { type: "string" },
                gst_amount: { type: "string" },
                discount: { type: "string" },
                discount_amount: { type: "string" },
                vat: { type: "string" },
                vat_amount: { type: "string" },
                amount: { type: "string" },
                cess: { type: "string" },
                cess_amount: { type: "string" },
                sgst: { type: "string" },
                cgst: { type: "string" },
                pack_flag: { type: "integer" },
                pack_qty: { type: "string" },
                self_life: { type: "integer" },
                accepted_margin: { type: "string" },
                purchase: { type: "boolean" },
                company_id: { type: "integer" },
                supplier_id: { type: "integer" },
                soh: { type: "string" },
                hsn: { type: "string" },
                purchase_batch_details: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      purchase_master_id: { type: "integer" },
                      product_id: { type: "integer" },
                      product_code: { type: "string" },
                      batch_no: { type: "string" },
                      qty: { type: "integer" },
                      self_life_qty: { type: "integer" },
                      expiry_type: { type: "integer" },
                      return_qty: { type: "integer" },
                      manufacture_date: { type: "string", format: "date-time" },
                      expiry_date: { type: "string", format: "date-time" },
                      expiry_value: { type: "integer" },
                      company_id: { type: "integer" }
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

module.exports = getPurchaseGrnByIdSchema;