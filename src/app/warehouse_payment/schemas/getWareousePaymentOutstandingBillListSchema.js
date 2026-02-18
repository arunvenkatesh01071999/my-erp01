const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getWareousePaymentOutstandingBillListSchema = {
  tags: ["HEADS"],
  summary: "Get Supplier Outstanding Bill Details",
  headers: { $ref: "request-headers#" },

  params: {
    type: "object",
    required: ["warehouse_id", "supplier_id"],
    additionalProperties: false,

    properties: {
      warehouse_id: { type: "integer" },
      supplier_id: { type: "integer" },
      page_size: { type: "integer", default: 10 },
      current_page: { type: "integer", default: 1 }
    }
  },

  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              bill_no: { type: "string" },
              bill_date: { type: "string", format: "date" },
              bill_amount: { type: "string" },
              outstanding_amt: { type: "string" },
              invoice_no: { type: "string" }
            },
            required: [
              "bill_no",
              "bill_date",
              "bill_amount",
              "outstanding_amt",
              "invoice_no"
            ]
          }
        },

        meta: {
          type: "object",
          properties: {
            pagination: {
              type: "object",
              properties: {
                total: { type: "integer" },
                page: { type: "integer" },
                page_size: { type: ["integer", "string"] },
                total_pages: { type: "integer" }
              },
              required: ["total", "page", "page_size", "total_pages"]
            }
          }
        }
      }
    },

    ...errorSchemas
  }
}

module.exports = getWareousePaymentOutstandingBillListSchema;
