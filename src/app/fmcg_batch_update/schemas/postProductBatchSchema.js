const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postProductBatchSchema = {
    tags: ["ProductBatch"],
    summary: "Post Product Batch Items",

    headers: { $ref: "request-headers#" },

    body: {
        type: "array",

        items: {
            type: "object",

            required: [
                "product_id",
                "product_code",
                "batch_no",
                "manufacture_date",
                "expiry_value",
                "expiry_type",
                "expiry_date"
            ],

            properties: {
                product_id: {
                    type: "integer",
                    errorMessage: "product_id must be an integer"
                },
                product_code: {
                    type: "string",
                    errorMessage: "product_code must be a string"
                },
                batch_no: {
                    type: "string",
                    errorMessage: "batch_no must be a string"
                },
                manufacture_date: {
                    type: "string",
                    format: "date",
                    errorMessage: "manufacture_date must be a valid date"
                },
                expiry_value: {
                    type: "integer",
                    errorMessage: "expiry_value must be an integer"
                },
                expiry_type: {
                    type: "integer",
                    errorMessage: "expiry_type must be an integer"
                },
                expiry_date: {
                    type: "string",
                    format: "date",
                    errorMessage: "expiry_date must be a valid date"
                }
            }
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

module.exports = postProductBatchSchema;
