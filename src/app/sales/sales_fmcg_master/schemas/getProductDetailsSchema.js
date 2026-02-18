const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getProductDetailsSchema = {
  tags: ["PRODUCT DETAILS"],
  summary: "This product details to get all information",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      customer_id: { type: "integer" }
    },
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          product_id: { type: "integer" },
          product_code: { type: "string" },
          product_name: { type: "string" },
          main_catgory_id: { type: "integer" },
          supplier_id: { type: "integer" },
          mrp: { type: "number" },
          sale_rate: { type: "number" },
          main_category_name: { type: "string" },
          expiry_type_id: { type: "integer" },
          expiry_value: { type: "integer" },
          uom_id: { type: "integer" },
          pur_rate: { type: "number" },
          discount: { type: "integer" },
          gst: { type: "integer" },
          cess: { type: "integer" },
          barcode: { type: "string" },
          units_short_name: { type: "string" },
          mrp_list: {
            type: "array",
            items: {
              type: "object",
              properties: {
                mrp: { type: "number" },
              },
            },
          },
          manufacture_date: { type: "string" },
          expiry_date: { type: "string" },
          indent_qty: { type: "integer" },
          qty: { type: "integer" },
          outlet_rate: { type: "number" },
          defaultPurchaseRate: { type: "number" },
          discount_amount: { type: "number" },
          gst_amount: { type: "number" },
          cess_amount: { type: "number" },
          amount: { type: "number" },
          tray_id: { type: "integer" },
          tray_count: { type: "number" },
        },
      },
    },
    ...errorSchemas,
  },
};

module.exports = getProductDetailsSchema;
