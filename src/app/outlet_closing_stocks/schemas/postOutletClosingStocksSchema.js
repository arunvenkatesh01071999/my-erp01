const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postOutletClosingStocksSchema = {
    tags: ["OUTLET CLOSING STOCK"],
    summary: "Post outlet closing stock for a date",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["outlet_closing_stocks"],
        properties: {
            outlet_closing_stocks: {
                type: "array",
                minItems: 1,
                items: {
                    type: "object",
                    required: [
                        "docdate",
                        "prodid",
                        "physical_qty",
                        "computer_qty",
                        "purchase_rate",
                        "sales_rate",
                        "mrp",
                        "company_id",
                        "outlet_id"
                    ],
                    properties: {
                        docdate: {
                            type: "string",
                            format: "date" // YYYY-MM-DD
                        },
                        prodid: { type: "integer" },
                        physical_qty: { type: "number" },
                        computer_qty: { type: "number" },
                        purchase_rate: { type: "number" },
                        sales_rate: { type: "number" },
                        mrp: { type: "number" },
                        company_id: { type: "integer" },
                        outlet_id: { type: "integer" }
                    },
                    additionalProperties: false
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

module.exports = postOutletClosingStocksSchema;
