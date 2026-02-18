const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSubWarehouseStocksSchema = {
  tags: ["OutletSales"],
  summary: "Get item details for outlet sales by product barcode",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    required: ["barcode"],
    properties: {
      barcode: { type: "string" },
      outlet_id: { type: "string" }
    }
  },
  response: {
    200: {
      // type: "array", // Since the response is an array
      // items: {
      type: "object",
      properties: {
        id: { type: "integer" },
        prod_id: { type: "integer" },
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
        pro_description: { type: ["string", "null"] }, // Allows null values
        main_product_qty: { type: "integer" },
        short_name: { type: "string" },
        discount: { type: "string" },
        is_active: { type: "boolean" },
        barcode: { type: "string" },
        special_discount: { type: "string" },
        qty: { type: "integer" }
      }
      // required: [
      //   "id", "pro_code", "pro_name", "pur_rate", "sale_rate", "wholesale_rate",
      //   "mrp", "gst", "cess", "hsn", "type", "type_name", "uom_name", "uom",
      //   "head_name", "head_id", "sub_cat", "sub_cat_name", "cat_id", "cat_name",
      //   "product_type", "main_product_id", "convertion_factor", "main_product_qty",
      //   "short_name", "discount", "is_active", "barcode", "special_discount", "qty"
      // ]
      // }
    },
    ...errorSchemas
  }
};

module.exports = getSubWarehouseStocksSchema;
