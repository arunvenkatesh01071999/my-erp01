const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const stockMissingReportNewSchema = {
    tags: ["stockMissing Report"],
    summary: "This API is to get stockMissing report",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["from_date", "to_date", "customer"],
        additionalProperties: false,
        properties: {
            from_date: { type: "string", format: "date" },
            to_date: { type: "string", format: "date" },
            customer: { type: "integer" },
            search: { type: "string" }
        }
    },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    docdate: { type: "string" },
                    barcode: { type: "string" },
                    mrp: { type: "number" },
                    pro_name: { type: "string" },
                    category_name: { type: "string" },
                    subcategory_name: { type: "string" },
                }
            }
        },
        ...errorSchemas
    }
};

module.exports = stockMissingReportNewSchema;
