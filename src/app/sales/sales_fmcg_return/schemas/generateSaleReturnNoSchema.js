const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSalesReturnDocnoSchema = {
    tags: ["getSalesReturnDocnoSchema"],
    summary: "This API is to get SALES RETURN DOCNO",
    headers: { $ref: "request-headers#" },
    response: {
        200: {
            type: "object",
            properties: {
                docno: { type: "string" },
            },
        },
        ...errorSchemas,
    },
};

module.exports = getSalesReturnDocnoSchema;
