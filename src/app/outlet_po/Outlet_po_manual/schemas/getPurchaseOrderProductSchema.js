const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getPurchaseOrderProductSchema = {
  tags: ["Product"],
  summary: "API to list products with detailed purchase details",
  headers: { $ref: "request-headers#" },

  params: {
    type: "object",
    properties: {
      vendor_id: { type: "integer" },
      company_id: { type: "integer" },
      outlet_id: { type: "integer" }
    },
    required: ["vendor_id", "company_id", "outlet_id"]
  },

  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "string" },
        po_date: { type: "string", format: "date" },

        supplierDetails: {
          type: "object",
          nullable: true,
          properties: {
            supplier_id: { type: "integer" },
            supplier_name: { type: "string" },
            supplier_short_name: { type: "string" },
            supplier_add1: { type: "string" },
            supplier_add2: { type: "string" },
            supplier_add3: { type: "string" },
            supplier_add4: { type: "string" },
            supplier_state_name: { type: "string" },
            supplier_city_name: { type: "string" },
            supplier_country_name: { type: "string" },
            outlet_name: { type: "string" },
            outlet_id: { type: "integer" },
            region_id: { type: "integer" }
          }
        },

        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              pro_code: { type: "string" },
              pro_name: { type: "string" },
              main_catgory_id: { type: "integer" },
              main_category_name: { type: "string" },
              brand_company_id: { type: "integer" },
              uom_id: { type: "integer" },

              mrp: { type: "number" },
              pur_rate: { type: "number" },

              soh: { type: "number" },
              balance: { type: "number" },

              gst: { type: "string" },
              cess: { type: "string" },

              margin: { type: "number" },
              vendor_discount_type: { type: "number" },
              vendor_discount_value: { type: "string" },
              numeric_product_code: { type: "number" },
              sales_qty: { type: "number" },
              phy_qty: { type: "number" },

              cgst: { type: "number" },
              sgst: { type: "number" },

              min_mbq: { type: "number" },

              PackQty: { type: "number" },
              Transit_Qty: { type: "number" },
              suggested_Qty: { type: "number" },
              RequiredQty: { type: "number" },
              orderQty: { type: "number" },

              purchase_order_type: { type: "number" },
              cost_price: { type: "number" },
              qty: { type: "number" },

              averageQty: { type: "number" },
              Daily_Run_Rate: { type: "number" },

              sales_days: { type: "number" },

              MAXMBQ: { type: "number" },
              Totalbalance: { type: "number" },
              stockbalance: { type: "number" },
              finalPackQty: { type: "number" },
              finalMBQ: { type: "number" },
              landing_price: { type: "number" },
              caseQty: { type: "number" },
              ts: { type: "number" },
              vlt: { type: "number" },
              paway: { type: "integer" },
              caseQty: { type: "number" },
              mbq: { type: "number" },
            }
          }
        }
      }
    },

    ...errorSchemas
  }
};

module.exports = getPurchaseOrderProductSchema;
