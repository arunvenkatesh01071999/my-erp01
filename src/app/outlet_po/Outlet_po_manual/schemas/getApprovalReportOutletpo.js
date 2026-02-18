const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getApprovalReportOutletpo = {
    tags: ["Outlet PURCHASE ORDER"],
    summary: "API to list PO approval report",
    headers: { $ref: "request-headers#" },

    params: {
        type: "object",
        properties: {
            from_date: { type: "string", format: "date" },
            to_date: { type: "string", format: "date" },
            company_id: { type: "integer" }
        },
        required: ["from_date", "to_date", "company_id"]
    },

    body: {
        type: "object",
        required: ["outlet_id", "region_id"],
        properties: {
            outlet_id: {
                type: "array",
                items: { type: "integer" }
            },
            region_id: { type: "integer" },

            supplier_id: {
                type: "array",
                items: { type: "integer" }
            },

            brand_company_id: {
                type: "array",
                items: { type: "integer" }
            },
        }
    },

    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                additionalProperties: true
            }
        },
        ...errorSchemas
    }
};

module.exports = getApprovalReportOutletpo;
