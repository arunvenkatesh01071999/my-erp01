const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const iscloseBarcodeSchema = {
    tags: ["Barcode Deactivate"],
    summary: "This API is to post barcode deactivate",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["outlet_id", "is_closed"],
        properties: {
            outlet_id: { type: "integer" },
            is_closed: { type: "integer" }
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

module.exports = iscloseBarcodeSchema;
