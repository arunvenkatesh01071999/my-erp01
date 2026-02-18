const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getOutletPurchaseSupplierListSchema = {
  tags: ["Grn Outlet Supplier "],
  summary: "API to list suppliers with detailed information for grn outlet based.",
  headers: { $ref: "request-headers#" },

  params: {
    type: "object",
    properties: {
      outlet_id: { type: "integer" },
    },
    required: ["outlet_id"]
  },

  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          supplier_name: { type: "string" },
          short_name: { type: "string" },
          add1: { type: "string" },
          add2: { type: "string" },
          add3: { type: "string" },
          add4: { type: "string" },
          supplier_state_name: { type: "string" },
          supplier_city_name: { type: "string" },
          supplier_country_name: { type: "string" },
          supplier_balance: { type: "number" },
          supplier_gstin: { type: "string" },
          supplier_mobile_no: { type: "string" },
          supplier_bank_ac_no: { type: "string" },
          gst_type: { type: "integer" }
        }
      }
    },

    ...errorSchemas
  }
};

module.exports = getOutletPurchaseSupplierListSchema;


