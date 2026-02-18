const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postClosingStockTempSchema = {
    tags: ["ClosingStockTemp"],
    summary: "This API is to post ClosingStockTemp",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["docdate", "prodid", "physical_qty", "computer_qty",
            "purchase_rate", "sales_rate", "mrp", "company_id", "outlet_id"
        ],
        properties: {
            docdate: { type: "string" },
            prodid: { type: "string" },
            physical_qty: { type: "integer" },
            computer_qty: { type: "integer" },
            purchase_rate: { type: "integer" },
            sales_rate: { type: "integer" },
            mrp: { type: "integer" },
            company_id: { type: "integer" }, 
            outlet_id: { type: "integer" }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                success: { type: "boolean" }
            }
        },
        ...errorSchemas
    }
};

module.exports = postClosingStockTempSchema;