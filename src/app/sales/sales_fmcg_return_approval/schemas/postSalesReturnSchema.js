const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postSalesReturnApprovalSchema = {
    tags: ["Sales"],
    summary: "Approve a sales return entry",
    headers: { $ref: "request-headers#" },

    body: {
        type: "object",
        required: ["docdate", "docno", "detail"],
        properties: {
            docdate: {
                type: "string",
                format: "date",
                errorMessage: "docdate must be a valid date"
            },
            docno: {
                type: ["string", "integer"],
                errorMessage: "docno must be a string or integer"
            },
            remark: { type: "string" },
            detail: {
                type: "array",
                minItems: 1,
                errorMessage: "detail must be a non-empty array",
                items: {
                    type: "object",
                    required: ["product_id", "qty"],
                    properties: {
                        product_id: { type: "integer" },
                        qty: { type: "number" }
                    }
                }
            }
        }
    },

    response: {
        200: {
            type: "object",
            properties: {
                success: { type: "boolean" },
                message: { type: "string" }
            }
        },
        ...errorSchemas
    }
};

module.exports = postSalesReturnApprovalSchema;
