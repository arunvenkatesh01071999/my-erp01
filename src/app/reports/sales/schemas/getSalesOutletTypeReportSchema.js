const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSalesOutletTypeReportSchema = {
    tags: ["Sales All Outlet Type Report"],
    summary: "This API Is To Sales All outlet type Report",
    headers: { $ref: "request-headers#" },

    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: ["integer"] },
                    outlet_type: { type: "string" },
                    company_id: { type: "integer" },
                    is_active: { type: "boolean" },
                    created_at: { type: "string" },
                    updated_at: { type: "string" }
                }
            }
        },
        ...errorSchemas
    }
};

module.exports = getSalesOutletTypeReportSchema;


