const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getPurchaseOrderPonoListSchema = {
    tags: ["PURCHASE ORDER LIST"],
    summary: "This API is to get purchase order list",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            vendor_id: { type: "integer" },
            company_id: { type: "integer" }
        },
    },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    pono: { type: "string" },
                    podate: { type: "string" },
                    expiry_date: { type: "string" },
                    gst: { type: "boolean" },
                    igst: { type: "boolean" },
                },
            }
        },
        ...errorSchemas,
    },
};

module.exports = getPurchaseOrderPonoListSchema;
