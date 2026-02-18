const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postWarehouseExpenseSchema = {
  tags: ["POST WAREHOUSE EXPENSES SCHEMA"],
  summary: "This API is to post warehouse expenses",
  headers: { $ref: "request-headers#" },

  body: {
    type: "array",
    minItems: 1,

    items: {
      type: "object",

      required: [
        "doc_date",
        "account_id",
        "amount",
        "company_id",
        "warehouse_id",
        "warehouse_expenses_details"
      ],

      properties: {

        doc_date: { type: "string" },

        account_id: { type: "integer" },

        amount: { type: "number" },

        remarks: { type: "string" },

        company_id: { type: "integer" },

        warehouse_id: { type: "integer" },

        warehouse_expenses_details: {
          type: "array",
          minItems: 1,

          items: {
            type: "object",

            required: [
              "doc_date",
              "account_id",
              "sub_account_id",
              "amount"
            ],

            properties: {

              doc_date: { type: "string" },

              account_id: { type: "integer" },

              sub_account_id: { type: "integer" },

              amount: { type: "number" }
            }
          }
        }
      }
    }
  },

  response: {

    200: {
      type: "object",

      properties: {
        success: { type: "boolean" },
        message: { type: "string" }
      }
    },

    ...errorSchemas
  }
};

module.exports = postWarehouseExpenseSchema;
