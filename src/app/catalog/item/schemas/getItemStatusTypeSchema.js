const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getItemStatusType = {
    tags: ["Item"],
    summary: "This API is to  Excel Import Status",
    headers: { $ref: "request-headers#" },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    product_type_name: { type: "string" }
                }
            }
        }
    }
}

module.exports = getItemStatusType;