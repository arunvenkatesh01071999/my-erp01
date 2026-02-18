const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const deleteOutletClosingStocksTempSchema = {
    description: "Get outlet closing stocks temporary list",
    tags: ["Outlet", "Stock"],
    summary: "Outlet closing stocks temp list",
    params: {
        type: "object",
        required: ["outlet_id", "id"],
        properties: {
            outlet_id: { type: "integer" },
            id: { type: "integer" }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                success: { type: "boolean" }
            }
        },
        ...errorSchemas
    }
};

module.exports = deleteOutletClosingStocksTempSchema;
