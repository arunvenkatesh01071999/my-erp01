const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postSalesReturnReverseSchema = {
    tags: ["Sales"],
    summary: "Simple sales return approval input",
    headers: { $ref: "request-headers#" },

    body: {
        type: "object",
        required: ["docdate", "detail"],
        properties: {
            docdate: {
                type: "string",
                format: "date",
                errorMessage: "docdate must be a valid date"
            },
            detail: {
                type: "array",
                minItems: 1,
                errorMessage: "detail must be a non-empty array",
                items: {
                    type: "object",
                    required: ["product_id", "qty"],
                    properties: {
                        product_id: {
                            type: "integer",
                            errorMessage: "product_id must be an integer"
                        },
                        qty: {
                            type: "number",
                            errorMessage: "qty must be a number"
                        }
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
                message: { type: "string" },
                data: { type: "object" }
            }
        },
        ...errorSchemas
    }
};

module.exports = postSalesReturnReverseSchema;
