const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getUnitsSchema = {
    tags: ["UNITS"],
    summary: "This API is to fetch units",
    headers: { $ref: "request-headers#" },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    units_short_name: { type: "string" },
                    units_long_name: { type: "string" },
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

module.exports = getUnitsSchema;
