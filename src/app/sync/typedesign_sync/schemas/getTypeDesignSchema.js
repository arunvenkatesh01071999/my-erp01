const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getTypeDesignSchema = {
    tags: ["TYPEDESIGN"],
    summary: "This API is to fetch typedesign",
    headers: { $ref: "request-headers#" },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    type_name: { type: "string" },
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

module.exports = getTypeDesignSchema;
