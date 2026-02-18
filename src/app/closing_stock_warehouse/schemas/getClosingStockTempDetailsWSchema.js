const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getClosingStockTempDetailsSchema = {
    tags: ["Get Closing Stock temp"],
    summary: "This API is to get sales report",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["cat_id", "sub_cat_id"],
        additionalProperties: false,
        properties: {
            cat_id: { type: "integer" },
            sub_cat_id: { type: "integer" }
        }
    },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    prod_id: { type: "integer" },
                    barcode: { type: "string" },
                    sales_man_id: { type: "integer" },
                    cat_id: { type: "integer" },
                    sub_cat_id: { type: "integer" },
                    sales_man_code: { type: "string" },
                    sales_man_name: { type: "string" },
                    short_name: { type: "string" },
                    pro_code: { type: "string" },
                    pro_name: { type: "string" }
                }
            }
        },
        ...errorSchemas
    }
}

module.exports = getClosingStockTempDetailsSchema;