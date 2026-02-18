const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getIndentOrderProductDetailsAllSchema = {
    tags: ["Indent"],
    summary: "API to list indent orders with details",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            wh_id: { type: "integer" }
        },
        required: ["wh_id"],
    },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    outlet_id: { type: "integer" },
                    outlet_name: { type: "string" },
                    outlet_short_name: { type: "string" },
                    outlet_add1: { type: "string" },
                    outlet_add2: { type: "string" },
                    outlet_add3: { type: "string" },
                    outlet_add4: { type: "string" },

                },

            },
        },
        ...errorSchemas,
    },
};

module.exports = getIndentOrderProductDetailsAllSchema;
