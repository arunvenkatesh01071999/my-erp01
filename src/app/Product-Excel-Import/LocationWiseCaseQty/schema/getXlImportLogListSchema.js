const { type } = require("tap");
const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getXlImportLogListSchema = {
    tags: ["XL Import Logs"],
    summary: "API to fetch XL import logs",
    headers: { $ref: "request-headers#" },
    querystring: {
        type: "object",
        properties: {
            search: { type: "string" },
            from_date: { type: "string", format: "date" },
            to_date: { type: "string", format: "date" }
        }
    },
    params: {
        type: "object",
        properties: {
            page_size: { type: "integer" },
            current_page: { type: "integer" }
        }
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
                            xl_name: { type: "string" },
                            user_name: { type: "string" },
                            xl_detail: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        location: { type: "string" },
                                        product_code: { type: "string" },
                                        case_qty: { type: "number" }
                                    }
                                }
                            },
                            company_id: { type: "integer" },
                            created_at: { type: "string", format: "date-time" },
                            updated_at: { type: "string", format: "date-time" },
                            created_by: { type: "integer" },
                            updated_by: { type: "integer" }
                        }
                    }
                },
                meta: { $ref: "response-meta#" }
            }
        },
        ...errorSchemas
    }
};

module.exports = getXlImportLogListSchema;
