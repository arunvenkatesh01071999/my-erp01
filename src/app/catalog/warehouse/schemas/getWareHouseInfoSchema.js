const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getWarehouseInfoSchema = {
  tags: ["WAREHOUSE INFO"],
  summary: "This API is to get WareHouse Info",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      warehouse_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        warehouse_name: { type: "string" },
        short_name: { type: "string" },
        add1: { type: "string" },
        add2: { type: "string" },
        add3: { type: "string" },
        add4: { type: "string" },
        city_name: { type: "string" },
        city_id: { type: "integer" },
        pincode: { type: "string" },
        state_name: { type: "string" },
        state_id: { type: "integer" },
        country_name: { type: "string" },
        country_id: { type: "integer" },
        phone: { type: "string" },
        mobile: { type: "string" },
        email: { type: "string" },
        company_id: { type: "integer" },
        is_active: { type: "integer" },
        limitation: { type: "number" },
        gstin: { type: "string" },
        fssai: { type: "string" },
        bankacno: { type: "string" },
        bankname: { type: "string" },
        acname: { type: "string" },
        ifsccode: { type: "string" },
        is_gst: { type: "boolean" },
        wallet_balance: { type: "number" },
        main_warehouse: { type: "boolean" },
        contact_name: { type: "string" }

      }
    },
    ...errorSchemas
  }
};

module.exports = getWarehouseInfoSchema;
