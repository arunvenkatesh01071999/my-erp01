const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getGrnNoSchema = {
    tags: ["GENERATE PURCHASE NO"],
    summary: "This API is to get purchase docno",
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

module.exports = getGrnNoSchema;
