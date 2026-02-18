const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getPackingIssuePdfSchema = {
    tags: ["Packing Issue Master Info"],
    summary: "This API retrieves purchase details",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["docno"],
        properties: {
            docno: { type: "string" }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                id: { type: "integer" },
                docno: { type: "string" },
                docdate: { type: "string" },
                wh_id: { type: "integer" },
                total_items: { type: "integer" },
                total_qty: { type: "integer" },
                amount: { type: "string" },
                is_inward: { type: "boolean" },
                warehouse_id: { type: "integer" },
                warehouse_name: { type: "string" },
                warehouse_short_name: { type: ["string", "null"] },
                warehouse_add1: { type: "string" },
                warehouse_add2: { type: "string" },
                warehouse_add3: { type: "string" },
                warehouse_add4: { type: "string" },
                warehouse_city: { type: "string" },
                warehouse_state: { type: "string" },
                warehouse_country: { type: "string" },
                warehouse_pincode: { type: "string" },
                warehouse_phone: { type: "string" },
                warehouse_mobile: { type: "string" },
                warehouse_email: { type: "string" }

            }
        },
        ...errorSchemas
    }
};

module.exports = getPackingIssuePdfSchema;
