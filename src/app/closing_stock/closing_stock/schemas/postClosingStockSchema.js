const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postClosingStockSchema = {
  tags: ["ClosingStock"],
  summary: "This API is to post ClosingStock",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["closing_data"],
    properties: {
      closing_data: {
        type: "array",
        items: {
          type: "object",
          required: ["docdate", "prodid", "physical_qty", "company_id"],
          properties: {
            docdate: { type: "string" },
            prodid: { type: "integer" },
            physical_qty: { type: "number" },
            company_id: { type: "integer" }
          }
        }
      }
    }
  },
  response: {
    200: {
      oneOf: [
        {
          type: "array",
          items: {
            type: "object",
            properties: {
              prodid_ins: { type: "integer" },
              docdate_ins: { type: "string" },
              physical_qty_ins: { type: "integer" },
              company_id_ins: { type: "integer" },
              computer_qty_ins: { type: "string" },
              sales_rate_ins: { type: "string" },
              purchase_rate_ins: { type: "string" },
              mrp_ins: { type: "string" }
            }
          }
        },
        {
          type: "object",
          properties: {
            success: { type: "boolean" }
          }
        }
      ]
    },
    ...errorSchemas
  }
};



module.exports = postClosingStockSchema;
