const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const deleteIssueTransferTempSchema = {
    tags: ["DELETE USERS"],
    summary: "This API is to delete IssueTransfer",
    headers: { $ref: "request-headers#" },
    body: {
        type: 'object',
        required: ["docno", "outlet_id", "id"],
        properties: {
            docno: { type: 'string' },
            outlet_id: { type: 'integer' },
            id: { type: 'integer' }
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

module.exports = deleteIssueTransferTempSchema;
