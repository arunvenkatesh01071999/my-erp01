const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const generateOutletPurchaseDocnoSchema = {
    tags: ["Generate Outlet Grn Bill No"],
    summary: "This API is to get purchase docno",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            company_id: { type: "integer" },
            outlet_id: { type: "integer" },
        },
        required: ["company_id", "outlet_id"]
    },
    response: {
        200: {
            type: "object",
            properties: {
                Docno: { type: "string" },
            },
        },
        ...errorSchemas,
    },
};

module.exports = generateOutletPurchaseDocnoSchema;
