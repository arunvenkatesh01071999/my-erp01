const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getItemDetailsOutletsSalesProductSchema = {
  tags: ["OutletSales"],
  summary: "Get item details for outlet sales by product barcode",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    required: ["barcode", "outlet_id"],
    properties: {
      barcode: { type: "string" },
      outlet_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        pro_code: { type: "string" },
        pro_name: { type: "string" },
        pur_rate: { type: "string" },
        sale_rate: { type: "string" },
        wholesale_rate: { type: "string" },
        mrp: { type: "string" },
        gst: { type: "string" },
        cess: { type: "string" },
        hsn: { type: "string" },
        type: { type: "integer" },
        type_name: { type: "string" },
        uom_name: { type: "string" },
        uom: { type: "integer" },
        head_name: { type: "string" },
        head_id: { type: "integer" },
        sub_cat: { type: "integer" },
        sub_cat_name: { type: "string" },
        cat_id: { type: "integer" },
        cat_name: { type: "string" },
        product_type: { type: "string" },
        main_product_id: { type: "integer" },
        convertion_factor: { type: "string" },
        pro_description: { type: "string" },
        main_product_qty: { type: "integer" },
        short_name: { type: "string" },
        discount: { type: "string" },
        is_active: { type: "boolean" },
        barcode: { type: "string" },
        special_discount: { type: "string" },
        outlet_id: { type: "integer" },
        op_stk: { type: "string" },
        balance: { type: "string" },
        min_stock: { type: "string" },
        allow_neg_stk: { type: "boolean" },
        wscale: { type: "boolean" },
        outlet_min_warn_stock: { type: "boolean" },
        min_stock_waring_message: { type: "string" },
        min_stock_waring_flag: { type: "boolean" },
        is_floating: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getItemDetailsOutletsSalesProductSchema;
