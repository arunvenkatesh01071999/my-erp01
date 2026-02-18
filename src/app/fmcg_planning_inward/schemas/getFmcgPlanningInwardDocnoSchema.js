const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getFmcgPlanningInwardDocnoSchema = {
    tags: ["Fetch ProductPlanning Doc No"],
    summary: "This API is for managing Product Planning Inward.",
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




module.exports = getFmcgPlanningInwardDocnoSchema;
