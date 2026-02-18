const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postClosingStockWarehouseSchema = {
    tags: ["Closing Stock Report"],
    summary: "This API is to get closing stock report",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["from_date", "to_date", "category_id", "subcategory_id"],
        additionalProperties: false,
        properties: {
            from_date: { type: "string" },
            to_date: { type: "string" },
            // outlet: { type: "integer" },
            category_id: { type: "integer" },
            subcategory_id: { type: "integer" }
        }
    },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    // id: { type: "integer" },
                    category_name: { type: "string" },
                    subcategory_name: { type: "string" },
                    item_count: { type: "string" },
                    docdate: { type: "string" },
                    // pro_name: { type: "string" },
                    docdate: { type: "string" },
                    // sales_man_name: { type: "string" }

                }
            }
        },
        ...errorSchemas
    }
};

module.exports = postClosingStockWarehouseSchema;
