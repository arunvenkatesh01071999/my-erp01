const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getPurchaseGrnSchema = {
  tags: ["Purchase GRN Info"],
  summary: "This API is to get purchase grn Info",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      pono: { type: "string" },
      invoice_no: { type: "string" },
    },
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number" },
          supplier_name: { type: "string" },
          address1: { type: "string" },
          address2: { type: "string" },
          address3: { type: "string" },
          address4: { type: "string" },
          supplier_balance: { type: "number" },
          purchase: { type: "number" },
          sales: { type: "number" },
          purchase_return: { type: "number" },
          sales_return: { type: "number" },
          opening_stock: { type: "number" },
          closing_stock: { type: "number" },
          debit_note: { type: "number" },
          profit: { type: "number" },
          percentage: { type: "number" },
          avg_agreed_margin: { type: "number" },
          avg_fil_rate: { type: "number" },
          supplier_gstin: { type: "string" },
          company_gstin: { type: "string" },
          invoice_no: { type: "string" },
          invoice_date: { type: "string", format: "date-time" },
          company_id: { type: "integer" },
          gst: { type: "boolean" },
          igst: { type: "boolean" },
          po_details_lines: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "number" },
                prod_code: { type: "string" },
                pro_name: { type: "string" },
                uom_id: { type: "integer" },
                unit_name: { type: "string" },
                hsn: { type: "string" },
                mrp: { type: "number" },
                cost_price: { type: "number" },
                discount: { type: "number" },
                discount_amount: { type: "number" },
                gst: { type: "number" },
                igst: { type: "number" },
                cess: { type: "number" },
                po_qty: { type: "integer" },
                qty: { type: "integer" },
                free_qty: { type: "integer" },
                gross_amount: { type: "number" },
                purchase_rate: { type: "number" },
                accepted_margin: { type: "number" },
                purchase_margin: { type: "number" },
                sale_rate: { type: "number" },
                sales_margin: { type: "number" },
                batch_no: { type: "string" },
                expiry_date: { type: "string" },
                purchase_batch_details: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      purchase_grn_details_id: { type: "integer" },
                      product_id: { type: "integer" },
                      product_code: { type: "string" },
                      batch_no: { type: ["string", "number"] },
                      qty: { type: "number" },
                      self_life_qty: { type: "number" },
                      return_qty: { type: "number" }, // change from string
                      company_id: { type: "number" },
                      manufacture_date: { type: "string", format: "date-time" },
                      expiry_type: { type: "number" },
                      expiry_value: { type: "number" },
                      expiry_date: { type: "string", format: "date-time" }
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
                docdate: { type: "string" },
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

module.exports = getPurchaseGrnSchema;
