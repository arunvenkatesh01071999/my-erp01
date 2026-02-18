const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getReasonPaginationSchema = {
    tags: ["Reason List Pagiantion"],
    summary: "This API is to fetch reasons",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            page_size: { type: "integer" },
            current_page: { type: "integer" }
        },
        required: ["page_size", "current_page"]
    },
    response: {
        200: {
            type: "object",
            properties: {
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "integer" },
                            reason_name: { type: "string" },
                            company_id: { type: "integer" },
                            is_active: { type: "boolean" },
                        },
                    }
                },
                meta: {
                    $ref: "response-meta#"
                }
            },
            required: ["data", "meta"]
        },
        ...errorSchemas
    }
};

module.exports = getReasonPaginationSchema;
