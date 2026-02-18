const { errorSchemas } = require("../../../../commons/schemas/errorSchemas");


const outletSalesBranchWiseReportSchema = {
    tags: ["outlet Sales Itemwise Report"],
    summary: "This API is to get sales itemwise report",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["from_date", "to_date"],
        additionalProperties: false,
        properties: {
            from_date: { type: "string", format: "date" },
            to_date: { type: "string", format: "date" },
            customer: { type: "integer" },
            category: { type: "integer" },
            subcategory: { type: "integer" },
            product_name: { type: "string" },
            head: { type: "integer" },
            type: { type: "integer" },

        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                totalQty: { type: "number" },
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            pro_name: { type: "string" },
                            qty: { type: "number" },
                            fullname: { type: "string" },
                            short_name: { type: "string" },
                            outlet_id: { type: "integer" },
                            head_name: { type: "string" },
                            type_name: { type: "string" },
                            category_name: { type: "string" },
                            subcategory_name: { type: "string" }
                        }
                    }
                }
            }
        },
        ...errorSchemas
    }
}


module.exports = outletSalesBranchWiseReportSchema;
