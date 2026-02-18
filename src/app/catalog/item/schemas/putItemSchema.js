const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putItemSchema = {
  tags: ["Item"],
  summary: "This API is to update Item",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      id: { type: "integer" },
      company_id: { type: "integer" }
    }
  },
  body: {
    type: "object",
    required: [
      "pro_code",
      "short_name",
      "pro_name",
      "regional_name",
      "pro_description",
      "head_id",
      "main_catgory_id",
      "sub_category_id",
      "merchant_category_id",
      "typedesign_id",
      "main_uom_id",
      "company_id",
      "type_id",
      "mrp",
      "pur_rate",
      "sale_rate",
      "wholesale_rate",
      "expiry_type_id",
      "expiry_value",
      "gst",
      "cess",
      "hsn",
      "gst_inclusive",
      "putaway",
      "op_stk",
      "min_stock",
      "balance",
      "allow_neg_stk",
      "wscale",
      "bulk_item",
      "returnable_item",
      "purchase",
      "min_stock_warning",
      "batch_item",
      "warehouse",
      "discount",
      "is_active",
    ],
    properties: {
      pro_code: { type: "string" },
      short_name: { type: "string" },
      pro_description: { type: "string" },
      regional_name: { type: "string" },
      pro_name: { type: "string" },
      company_id: { type: "integer" },
      type_id: { type: "integer" }, //1- fmcg 2-f&v
      main_catgory_id: { type: "integer" },
      sub_category_id: { type: "integer" },
      merchant_category_id: { type: "integer" },
      head_id: { type: "integer" },
      typedesign_id: { type: "integer" },
      main_uom_id: { type: "integer" },
      mrp: { type: "number" },
      pur_rate: { type: "number" },
      sale_rate: { type: "number" },
      wholesale_rate: { type: "number" },
      gst: { type: "number" },
      cess: { type: "number" },
      hsn: { type: "string" },
      op_stk: { type: "number" },
      balance: { type: "number" },
      min_stock: { type: "number" },
      incharge_id: { type: "integer" },
      tray_id: { type: "integer" },
      expiry_type_id: { type: "integer" },
      expiry_value: { type: "integer" },
      mbq: { type: "number" },
      shrinkage: { type: "number" },
      case_qty: { type: "integer" },
      putaway: { type: "integer" }, // 0- putaway, 1- flowthrough
      bulk_item: { type: "boolean" },
      returnable_item: { type: "boolean" },
      purchase: { type: "boolean" },
      min_stock_warning: { type: "boolean" },
      batch_item: { type: "boolean" },
      allow_neg_stk: { type: "boolean" },
      gst_inclusive: { type: "boolean" },
      sales_margin_new: { type: "boolean" },
      wscale: { type: "boolean" },
      discount: { type: "string" },
      warehouse_id: { type: "integer" },
      parent_product_id: { type: "integer" },
      product_weight: { type: "string" },
      pack_product_id: { type: "integer" },
      pack_qty: { type: "string" },
      margin: { type: "string" },
      wastage: { type: "string" },
      session_id: { type: "integer" },
      priority: { type: "integer" },
      is_active: { type: "boolean" },
      outlets: {
        type: "array",
        items: {
          type: "object",
          required: ["outlet_id"],
          properties: {
            fullname: { type: "string" },
            outlet_id: { type: "integer" },
            outlet_opng_stock: { type: "number" },
            outlet_balnc_stock: { type: "number" },
            outlet_min_stock: { type: "number" },
            outlet_allow_neg_stk: { type: "boolean" },
            outlet_wscale: { type: "boolean" },
            outlet_purchase: { type: "boolean" },
            outlet_non_saleable: { type: "boolean" }
          }
        }
      },
      vendors: {
        type: "array",
        items: {
          type: "object",
          required: ["vendor_id"],
          properties: {
            vendor_id: { type: "integer" }
          }
        }
      },
      customers: {
        type: "array",
        items: {
          type: "object",
          required: ["customer_id"],
          properties: {
            customer_id: { type: "integer" }
          }
        }
      },
      company_details: {
        type: "array",
        items: {
          type: "object",
          required: ["company_id"],
          properties: {
            company_id: { type: "integer" }
          }
        }
      },
      warehouse: {
        type: "array",
        items: {
          type: "object",
          properties: {
            warehouse_id: { type: "integer" },
            is_active: { type: "boolean" },
          }
        }
      },
      barcode_details: {
        type: "array",
        items: {
          type: "object",
          required: ["barcode"],
          properties: {
            barcode: { type: "string" }
          }
        }
      },
      picker_details: {
        type: "array",
        items: {
          type: "object",
          required: ["picker_id"],
          properties: {
            picker_id: { type: "integer" }
          }
        }
      }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" }
      }
    },
    ...errorSchemas
  }
};

module.exports = putItemSchema;