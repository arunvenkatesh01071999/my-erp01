const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postClosingStockOutletSchema = {
    tags: ["Closing Stock Report"],
    summary: "This API is to get closing stock report",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["from_date", "to_date", "outlet", "category_id", "subcategory_id"],
        additionalProperties: false,
        properties: {
            from_date: { type: "string" },
            to_date: { type: "string" },
            outlet: { type: "integer" },
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
                    docdate: { type: "string" },
                    fullname: { type: "string" },
                    sales_man_name: { type: "string" },
                    category_name: { type: "string" },
                    subcategory_name: { type: "string" },
                    item_count: { type: "string" },
                    total_mrp: { type: "number" },
                    sales_lines: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                barcode: { type: "string" },
                                pro_name: { type: "string" },
                                pro_code: { type: "string" },
                                mrp: { type: "string" },
                                category_name: { type: "string" },
                                subcategory_name: { type: "string" },
                            }
                        }
                    }

                }
            }
        },
        ...errorSchemas
    }
};

module.exports = postClosingStockOutletSchema;
