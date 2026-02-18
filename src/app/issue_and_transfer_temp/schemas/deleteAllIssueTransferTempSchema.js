const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const deleteAllIssueTransferTempSchema = {
    tags: ["DELETE USERS"],
    summary: "This API is to delete IssueTransfer",
    headers: { $ref: "request-headers#" },
    body: {
        type: 'object',
        required: ["docno", "outlet_id"],
        properties: {
            docno: { type: 'string' },
            outlet_id: { type: 'integer' }
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

module.exports = deleteAllIssueTransferTempSchema;
