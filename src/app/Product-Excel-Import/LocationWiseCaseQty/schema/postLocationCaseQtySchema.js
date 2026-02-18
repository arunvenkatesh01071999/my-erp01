const { errorSchemas } = require("../../../commons/schemas/errorSchemas");


const postLocationCaseQtySchema = {
    tags: ["Location Case Qty"],
    summary: "API to upload Location-wise Case Qty",
    headers: { $ref: "request-headers#" },
    body: {
        type: "array",
        minItems: 1,
        items: {
            type: "object",
            required: ["location", "product_code", "case_qty"],
            properties: {
                location: { type: "string" },
                product_code: { type: "string" },
                case_qty: { type: "number" }
            }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                success: { type: "boolean" },
                inserted_count: { type: "integer" }
            }
        },
        ...errorSchemas
    }
};

module.exports = postLocationCaseQtySchema;
