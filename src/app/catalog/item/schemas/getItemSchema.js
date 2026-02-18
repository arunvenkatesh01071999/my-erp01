const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getItemsSchema = {
  tags: ["GET ITEMS"],
  summary: "This API is to get Items",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      id: { type: "integer" },
      take: { type: "integer" },
      skip: { type: "integer" }

    }
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          pro_code: { type: "string" },
          short_name: { type: "string" },
          pro_description: { type: "string" },
          regional_name: { type: "string" },
          pro_name: { type: "string" },
          company_id: { type: "integer" },
          company_name: { type: "string" },
          type_id: { type: "integer" },
          product_type_name: { type: "string" },
          main_category_id: { type: "integer" },
          main_category_name: { type: "string" },
          merchant_category_id: { type: "integer" },
          merchant_category_name: { type: "string" },
          sub_category_id: { type: "integer" },
          sub_category_name: { type: "string" },
          head_id: { type: "integer" },
          head_name: { type: "string" },
          typedesign_id: { type: "integer" },
          type_name: { type: "string" },
          main_uom_id: { type: "integer" },
          uom_id: { type: "integer" },
          uom_name: { type: "string" },
          mrp: { type: "string" },
          pur_rate: { type: "string" },
          sale_rate: { type: "string" },
          wholesale_rate: { type: "string" },
          gst: { type: "string" },
          cess: { type: "string" },
          hsn: { type: "string" },
          op_stk: { type: "string" },
          min_stock: { type: "string" },
          balance: { type: "string" },
          incharge_id: { type: "integer" },
          incharge_name: { type: "string" },
          tray_id: { type: "integer" },
          tray_name: { type: "string" },
          expiry_type_id: { type: "integer" },
          expiry_value: { type: "integer" },
          expiry_name: { type: "string" },
          mbq: { type: "integer" },
          shrinkage: { type: "integer" },
          case_qty: { type: "integer" },
          putaway: { type: "integer" },
          putaway_name: { type: "string" },
          bulk_item: { type: "boolean" },
          returnable_item: { type: "boolean" },
          purchase: { type: "boolean" },
          min_stock_warning: { type: "boolean" },
          batch_item: { type: "boolean" },
          outlet_purchase: { type: "boolean" },
          outlet_non_saleable: { type: "boolean" },
          allow_neg_stk: { type: "boolean" },
          gst_inclusive: { type: "boolean" },
          wscale: { type: "boolean" },
          convertion_factor: { type: "string" },
          discount: { type: "string" },
          expiry_date: { type: "string" },
          main_product_id: { type: "integer" },
          main_product_qty: { type: "integer" },
          is_active: { type: "boolean" },

        }
      }
    }
  }
}

module.exports = getItemsSchema;
