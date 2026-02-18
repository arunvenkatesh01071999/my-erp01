const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getProductDetailsSchema = {
  tags: ["Product"],
  summary: "API to list products with detailed information",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      vendor_id: { type: "integer" },
      company_id: { type: "integer" }
    },
    required: ["vendor_id", "company_id"]
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          supplier_name: { type: "string" },
          supplier_short_name: { type: "string" },
          supplier_add1: { type: "string" },
          supplier_add2: { type: "string" },
          supplier_add3: { type: "string" },
          supplier_add4: { type: "string" },
          supplier_state_name: { type: "string" },
          supplier_city_name: { type: "string" },
          supplier_country_name: { type: "string" },
          id: { type: "integer" },
          pro_code: { type: "string" },
          short_name: { type: "string" },
          pro_description: { type: "string" },
          regional_name: { type: "string" },
          pro_name: { type: "string" },
          company_id: { type: "integer" },
          type_id: { type: "integer" },
          main_catgory_id: { type: "integer" },
          sub_category_id: { type: "integer" },
          head_id: { type: "integer" },
          typedesign_id: { type: "integer" },
          main_uom_id: { type: "integer" },
          uom_id: { type: "integer" },
          mrp: { type: "string" },
          pur_rate: { type: "string" },
          cost_price: { type: "string" },
          sale_rate: { type: "string" },
          wholesale_rate: { type: "string" },
          gst: { type: "string" },
          cess: { type: "string" },
          hsn: { type: "string" },
          op_stk: { type: "string" },
          min_stock: { type: "string" },
          balance: { type: "string" },
          incharge_id: { type: "integer" },
          tray_id: { type: "integer" },
          expiry_type_id: { type: "integer" },
          expiry_value: { type: "integer" },
          mbq: { type: "integer" },
          shrinkage: { type: "integer" },
          case_qty: { type: "integer" },
          putaway: { type: "integer" },
          bulk_item: { type: "boolean" },
          returnable_item: { type: "boolean" },
          purchase: { type: "boolean" },
          min_stock_warning: { type: "boolean" },
          batch_item: { type: "boolean" },
          allow_neg_stk: { type: "boolean" },
          gst_inclusive: { type: "boolean" },
          wscale: { type: "boolean" },
          convertion_factor: { type: "string" },
          purchase_order_type: { type: "integer" },
          discount: { type: "string" },
          main_product_id: { type: "integer" },
          main_product_qty: { type: "integer" },
          is_active: { type: "boolean" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
          created_by: { type: "integer" },
          updated_by: { type: "integer" },
          is_inserted: { type: "boolean" },
          merchant_category_id: { type: "integer" },
          soh: { type: "number" },
          qty: { type: "number" },
          barcode: { type: "string" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getProductDetailsSchema;
