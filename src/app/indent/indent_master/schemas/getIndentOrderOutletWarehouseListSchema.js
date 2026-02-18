const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getIndentOrderOutletWarehouseListSchema = {
    tags: ["Indent"],
    summary: "API to list indent orders with details",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            outlet_id: { type: "integer" }
        },
        required: ["outlet_id"],
    },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    warehouse_id: { type: "integer" },
                    warehouse_name: { type: "string" },
                    warehouse_short_name: { type: "string" },
                    warehouse_add1: { type: "string" },
                    warehouse_add2: { type: "string" },
                    warehouse_add3: { type: "string" },
                    warehouse_add4: { type: "string" },

                },

            },
        },
        ...errorSchemas,
    },
};

module.exports = getIndentOrderOutletWarehouseListSchema;
