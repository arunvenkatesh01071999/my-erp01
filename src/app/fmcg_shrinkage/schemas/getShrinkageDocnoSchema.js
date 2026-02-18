const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getShrinkageDocnoSchema = {
    tags: ["Fetch FMCG Shrinkage Doc No"],
    summary: "This API is for managing Shrinkage.",
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




module.exports = getShrinkageDocnoSchema;
