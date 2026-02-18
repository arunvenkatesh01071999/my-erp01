const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getWastageDocnoSchema = {
    tags: ["Fetch FMCG Wastage Doc No"],
    summary: "This API is for managing Wastage.",
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




module.exports = getWastageDocnoSchema;
