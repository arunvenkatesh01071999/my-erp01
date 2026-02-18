const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deactivateBarcodeSchema = {
    tags: ["Barcode Deactivate"],
    summary: "This API is to post barcode deactivate",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["barcode", "is_active"],
        properties: {
            barcode: { type: 'string', minLength: 12, maxLength: 12 },
            is_active: { type: "boolean" }
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

module.exports = deactivateBarcodeSchema;
