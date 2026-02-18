const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const deleteFmcgPlanningIssueInfoSchema = {
    tags: ["Delete ProductPlanning"],
    summary: "This API is for managing Product Planning Issues.",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            planning_issue_id: { type: "integer" }
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




module.exports = deleteFmcgPlanningIssueInfoSchema;
