const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postClosingStockTempWSchema = {
    tags: ["ClosingStockTemp"],
    summary: "This API is to post ClosingStockTemp",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["barcode", "prod_id", "sales_man_id"],
        properties: {
            prod_id: { type: "integer" },
            barcode: { type: "string" },
            sales_man_id: { type: "integer" },
            cat_id: { type: "integer" },
            sub_cat_id: { type: "integer" }
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

module.exports = postClosingStockTempWSchema;