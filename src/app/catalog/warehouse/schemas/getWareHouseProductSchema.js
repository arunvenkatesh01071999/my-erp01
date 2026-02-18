const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getWareHouseProductSchema = {
  tags: ["WAREHOUSE INFO"],
  summary: "This API is to get WareHouse Info",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      product_code: { type: "string" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        product_id: { type: "integer" },
        product_code: { type: "string" },
        product_name: { type: "string" },
        warehouse_product_balance: { type: "number" },
        uom_id: { type: "integer" },
        unit_short_name: { type: "string" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getWareHouseProductSchema;
