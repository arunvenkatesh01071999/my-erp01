const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getOutletGrnByIdSchema = {
  tags: ["OUTLETS GRN BY ID"],
  summary: "API to get outlets GRN details by ID",
  headers: { $ref: "request-headers#" },

  params: {
    type: "object",
    required: ["grn_id"],
    properties: {
      grn_id: { type: "integer" }
    }
  },

  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        financial_year: { type: "string" },
        docno: { type: "string" },
        docdate: { type: "string", format: "date" },
        company_id: { type: "integer" },
        wh_id: { type: "integer" },
        supplier_id: { type: "integer" },
        supplier_name: { type: "string" },
        supplier_code: { type: "string" },
        outlet_id: { type: "integer" },
        outlet_name: { type: "string" },

        invoice_no: { type: "string" },
        invoice_date: { type: "string", format: "date" },
        customer_type: { type: "integer" },
        pono: { type: "string" },
        podate: { type: "string", format: "date" },

        status: { type: "integer" },

        grand_total_amt: { type: "number" },
        sub_total_amt: { type: "number" },
        total_return_amt: { type: "number" },
        total_gst_amt: { type: "number" },
        total_igst_amt: { type: "number" },
        total_cess_amt: { type: "number" },

        total_order_qty: { type: "number" },
        total_received_qty: { type: "number" },
        total_return_qty: { type: "number" },
        total_items: { type: "integer" },

        discount: { type: "number" },
        roff: { type: "number" },
        fright_charges: { type: "number" },
        other_charges: { type: "number" },
        advance: { type: "number" },
        tcs: { type: "number" },

        product_type: { type: "integer" },
        remark: { type: "string" },
        return_remark: { type: "string" },

        purchase: { type: "boolean" },
        is_active: { type: "boolean" },

        created_by: { type: "integer" },
        updated_by: { type: "integer" },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },

        outlet_grn_no: { type: "string" },
        outlet_grn_details: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              outlet_purchase_mst_id: { type: "integer" },

              financial_year: { type: "string" },
              docno: { type: "string" },
              docdate: { type: "string", format: "date" },
              po_no: { type: "string" },

              company_id: { type: "integer" },
              supplier_id: { type: "integer" },
              outlet_id: { type: "integer" },

              prod_id: { type: "integer" },
              prod_code: { type: "string" },
              prod_name: { type: "string" },

              cat_id: { type: "integer" },
              sub_cat_id: { type: "integer" },
              head_id: { type: "integer" },
              type_design_id: { type: "integer" },
              brand_company_name: { type: "string" },

              uom_id: { type: "integer" },
              barcode: { type: "string" },
              hsn_code: { type: "string" },

              qty: { type: "number" },
              free_qty: { type: "number" },
              return_qty: { type: "number" },
              temp_rec_qty: { type: "number" },
              temp_grn_return_qty: { type: "number" },

              mrp: { type: "number" },
              sale_rate: { type: "number" },
              purchase_rate: { type: "number" },
              accepted_margin: { type: "number" },

              discount: { type: "number" },
              discount_amount: { type: "number" },

              gst: { type: "number" },
              gst_amount: { type: "number" },
              igst: { type: "number" },
              igst_amount: { type: "number" },
              sgst: { type: "number" },
              cgst: { type: "number" },
              cess: { type: "number" },
              cess_amount: { type: "number" },

              amount: { type: "number" },
              return_amount: { type: "number" },
              self_life_expiry_days: { type: "integer" },

              purchase: { type: "boolean" },
              is_actvie: { type: "boolean" },

              created_by: { type: "integer" },
              updated_by: { type: "integer" },
              created_at: { type: "string", format: "date-time" },
              updated_at: { type: "string", format: "date-time" },

              outlet_grn_batch_details: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    outlet_purchase_master_id: { type: "integer" },

                    product_id: { type: "integer" },
                    product_code: { type: "string" },

                    batch_no: { type: "string" },
                    qty: { type: "number" },
                    mrp: { type: "number" },
                    self_life_expiry_days: { type: "integer" },
                    return_qty: { type: "number" },

                    company_id: { type: "integer" },
                    manufacture_date: { type: "string", format: "date" },

                    expiry_id: { type: "integer" },
                    expiry_value: { type: "integer" },
                    expiry_date: { type: "string", format: "date" }
                  }
                }
              }
            }
          }
        },

        outlet_grn_free_item_details: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              outlet_purchase_grn_mst_id: { type: "integer" },
              product_id: { type: "integer" },
              product_code: { type: "string" },
              free_product_code: { type: "string" },
              free_product_name: { type: "string" },
              qty: { type: "number" },
              mrp: { type: "number" }
            }
          }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getOutletGrnByIdSchema;
