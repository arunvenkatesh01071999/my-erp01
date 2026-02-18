const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getShrinkageEditListSchema = {
    tags: ["SHRINKAGE EDIT LIST"],
    summary: "This API is to get shrinage edit list",
    headers: { $ref: "request-headers#" },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    w_id: { type: "integer", errorMessage: "w_id must be an integer" },
                    w_date: { type: "string", format: "date-time", errorMessage: "w_date must be a valid date-time format" }
                },
                required: ["w_id", "w_date"]
            }
        },
        ...errorSchemas
    }
};

module.exports = getShrinkageEditListSchema;
