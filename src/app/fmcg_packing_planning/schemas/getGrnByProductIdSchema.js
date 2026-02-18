const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getGrnByProductIdSchema = {
    tags: ["FMCG GRN List"],
    summary: "This API is to get FMCG GRN List",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            product_id: { type: "integer" }
        },
        required: ["product_id"]
    },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    purchase_id: { type: "integer" },
                    purchase_no: { type: "string" },
                    purchase_date: { type: "string", format: "date" },
                    purchase_detail_id: { type: "integer" },
                    product_id: { type: "integer" },
                    total_qty: { type: "string" },
                    packed_qty: { type: "number" },
                    remaining_qty: { type: "string" },
                    supplier_name: { type: "string" }
                },
            }
        },
        ...errorSchemas
    }
};

module.exports = getGrnByProductIdSchema;
