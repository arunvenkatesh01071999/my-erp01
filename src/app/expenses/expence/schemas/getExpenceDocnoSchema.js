const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getExpenceDocnoSchema = {
    tags: ["HEADS"],
    summary: "This API is to post Purchase",
    headers: { $ref: "request-headers#" },

    response: {
        200: {
            type: "object",
            properties: {
                Docno: { type: 'string' }
            },
        },
        ...errorSchemas,
    },
};

module.exports = getExpenceDocnoSchema;
