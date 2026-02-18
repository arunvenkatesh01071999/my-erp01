const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getReceipeDocnoSchema = {
    tags: ["Fetch Receipe Doc No"],
    summary: "This API is for managing Receipes masters.",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            wh_id: { type: "integer" }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                date: { type: "string", format: "date" },
                docno: { type: "string" }
            }
        },
        ...errorSchemas
    }
};




module.exports = getReceipeDocnoSchema;
