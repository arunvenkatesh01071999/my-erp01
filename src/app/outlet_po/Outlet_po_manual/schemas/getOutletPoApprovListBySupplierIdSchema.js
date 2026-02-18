const { errorSchemas } = require("../../../commons/schemas/errorSchemas");


const getOutletPoApprovListBySupplierIdSchema = {
  tags: ["Outlet PURCHASE ORDER APPROVAL LIST BY SUPPLIERID"],
  summary:
    "API to purchase order approval list by supplier ID (product wise, po_date wise, outlet wise)",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      region_id: { type: "integer" },
      outlet_id: { type: "integer" },
      brand_company_id: { type: "integer" },
    },
    required: ["brand_company_id", "region_id"],
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          supplier_name: { type: "string", example: "Thalaanki Agency" },
          outlet_name: { type: "string", example: "Harlur" },
          outlet_id: { type: "integer" },
          store_code: { type: "string", example: "3001" },
          supplier_id: { type: "integer" },
          pono: { type: "string", example: "199174" },
          product_code: { type: "string", example: "199174" },
          product_name: { type: "string", example: "Milky Mist Chocolate Ice Cream" },
          id: { type: "integer", example: 124 },
          mrp: { type: "string", example: "170" },
          vendordiscountvalue: { type: "string", example: "25.50" },
          base_price: { type: "number", example: "25.50" },
          gst_percentage: { type: "integer", example: 124 },
          lp: { type: "number", example: "50.45" },
          case_qty: { type: "number", example: 0 },
          pack_qty: { type: "integer", example: "10" },
          min_mbq_qty: { type: "integer", example: "10" },
          mbqdays: { type: "number", example: 0 },
          sale_qty: { type: "integer", example: "22" },
          stock_days: { type: "integer", example: "0" },
          average_qty: { type: "number", example: 0 },
          doh: { type: "number", example: 0 },
          po_qty: { type: "number", example: 0 },
          soh: { type: "number", example: 0 },
          po_date: { type: "string", format: "date" },
        },
        required: [
          "supplier_name",
          "outlet_name",
          "product_code",
          "product_name",
          "mrp",
          "vendordiscountvalue",
          "base_price",
          "gst_percentage",
          "lp",
          "case_qty",
          "pack_qty",
          "min_mbq_qty",
          "mbqdays",
          "sale_qty",
          "stock_days",
          "average_qty",
          "doh",
          "soh",
          "po_qty",
          "po_date"
        ],
      },
    },
    ...errorSchemas,
  },
};

module.exports = getOutletPoApprovListBySupplierIdSchema;
