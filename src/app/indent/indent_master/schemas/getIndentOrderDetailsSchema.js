const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getIndentOrderDetailsSchema = {
    tags: ["Indent"],
    summary: "API to list indent orders with details",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            wh_id: { type: "integer" },
            outlet_id: { type: "integer" },
            indent: { type: "integer" }   // auto - 0, manual- 1
        }
    },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    indent_no: { type: "string" }
                },

            },
        },
        ...errorSchemas,
    },
};

module.exports = getIndentOrderDetailsSchema;
