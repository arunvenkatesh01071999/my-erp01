const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const deleteWarehouseExpenseSchema = {
    tags: ["delete warehouse expense"],
    summary: "API to delete a warehouse expense",
    headers: { $ref: "request-headers#" },

    params: {
        type: "object",
        properties: {
            expense_mst_id: { type: "integer" }
        },
        required: ["expense_mst_id"]
    },

    response: {
        200: {
            type: "object",
            required: ["success", "message"],
            properties: {
                success: { type: "boolean" },
                message: { type: "string" }

            }
        },

        ...errorSchemas
    }
};

module.exports = deleteWarehouseExpenseSchema;
