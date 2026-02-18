const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const deleteFmcgPlanningInwardInfoSchema = {
    tags: ["Delete ProductPlanningInward"],
    summary: "This API is for managing Product Planning Inward.",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            planning_inward_id: { type: "integer" }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                success: { type: "boolean" },
                message: { type: "string" }
            }
        },
        ...errorSchemas
    }
};




module.exports = deleteFmcgPlanningInwardInfoSchema;
