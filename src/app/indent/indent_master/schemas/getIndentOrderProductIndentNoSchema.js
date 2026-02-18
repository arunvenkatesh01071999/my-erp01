const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getIndentOrderProductIndentNoSchema = {
    tags: ["SALES"],
    summary: "This API is to get SALES DOCNO",
    headers: { $ref: "request-headers#" },
    response: {
        200: {
            type: "object",
            properties: {
                Docno: { type: "string" },
            },
        },
        ...errorSchemas,
    },
};

module.exports = getIndentOrderProductIndentNoSchema;
