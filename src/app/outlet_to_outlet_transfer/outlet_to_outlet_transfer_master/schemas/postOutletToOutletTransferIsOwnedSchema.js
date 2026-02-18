const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postOutletToOutletTransferIsOwnedSchema = {
    tags: ["postOutletToOutletTransferIsOwned"],
    summary: "This API is to postOutletToOutletTransferIsOwned",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["docno"],
        properties: {
            docno: { type: "string" },
            outletid: { type: "integer" },
            is_approved: { type: "boolean" },
            is_approved_date: { type: "string" }
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


module.exports = {
    postOutletToOutletTransferIsOwnedSchema,

}

