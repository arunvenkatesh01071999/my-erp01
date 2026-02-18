const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getautogeneratepoSchema = {
    tags: ["Product"],
    summary: "API to list products with detailed information",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            company_id: { type: "integer" }
        },
        required: ["company_id"]
    },
    response: {
        200: {
            type: "object",
            properties: {
                success: { type: "boolean" }
            }
        },
        ...errorSchemas
    }
};

module.exports = getautogeneratepoSchema;
