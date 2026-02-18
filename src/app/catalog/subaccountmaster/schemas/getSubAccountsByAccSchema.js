const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSubAccountsByAccSchema = {
    tags: ["CATEGORY"],
    summary: "This API is to fetch sub categories",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            acc_id: { type: "integer" }
        }
    },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    sub_account_name: { type: "string" },
                    acc_id: { type: "integer" },
                    acname: { type: "string" },
                    is_active: { type: "boolean" }
                }
            },
            meta: { $ref: "response-meta#" }
        },

        ...errorSchemas
    }
};

module.exports = getSubAccountsByAccSchema;
