const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getHeadsSchema = {
    tags: ["HEADS"],
    summary: "This API is to fetch heads",
    headers: { $ref: "request-headers#" },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    cateogory_name: { type: "string" },
                    company_id: { type: "integer" },
                    is_inserted: { type: "boolean" },
                    is_active: { type: "boolean" }
                }
            },
            meta: { $ref: "response-meta#" }
        },

        ...errorSchemas
    }
};

module.exports = getHeadsSchema;
