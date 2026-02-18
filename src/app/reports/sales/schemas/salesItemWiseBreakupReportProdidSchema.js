const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const salesItemWiseBreakupReportProdidSchema = {
    tags: ["Sales Itemwise Report"],
    summary: "This API is to get sales itemwise report",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["from_date", "to_date", "customer", "category", "subcategory", "prodid"],
        additionalProperties: false,
        properties: {
            from_date: { type: "string", format: "date" },
            to_date: { type: "string", format: "date" },
            customer: { type: "integer" },
            category: { type: "integer" },
            subcategory: { type: "integer" },
            prodid: { type: "integer" }
        }
    },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    docdate: { type: "string", format: "date" },
                    prodid: { type: "integer" },
                    pro_code: { type: "string" },
                    pro_name: { type: "string" },
                    qty: { type: "number" },
                    amount: { type: "string" }


                }
            }
        },
        ...errorSchemas
    }
};

module.exports = salesItemWiseBreakupReportProdidSchema;
