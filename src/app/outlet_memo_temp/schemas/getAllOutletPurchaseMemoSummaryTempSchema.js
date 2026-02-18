const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getAllOutletPurchaseMemoTempListSchema = {
  tags: ["OUTLET PURCHASE MEMO TEMP"],
  summary: "API to get outlet-wise purchase memo temp list",
  headers: { $ref: "request-headers#" },

  params: {
    type: "object",
    properties: {
      outlet_id: { type: "integer" }
    },
    required: ["outlet_id"]
  },

  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        required: [
          "memo_no",
          "memo_date",
          "pono",
          "podate",
          "party_invoice_no",
          "party_invoice_date",
          "invoice_amount",
          "image_url",
          "outlet_name",
          "supplier_id",
          "supplier_name",
          "user_name",
          "itemCount"
        ],
        properties: {
          memo_no: { type: "string" },
          memo_date: { type: "string", format: "date" },
          pono: { type: "string" },
          podate: { type: "string", format: "date" },
          party_invoice_no: { type: "string" },
          party_invoice_date: { type: "string", format: "date" },
          invoice_amount: {
            type: ["string", "number"]
          },

          image_url: {
            type: ["string", "null"]
          },

          outlet_name: {
            type: ["string", "null"]
          },
          supplier_id: {
            type: "number"
          },
          supplier_name: {
            type: ["string", "null"]
          },
          user_name: {
            type: ["string", "null"]
          },
          itemCount: {
            type: ["number", "null"]
          },


        }
      }
    },

    ...errorSchemas
  }
};

module.exports = getAllOutletPurchaseMemoTempListSchema;
