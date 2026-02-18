const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const isMissedBarcodeSchema = {
    tags: ["Barcode Deactivate"],
    summary: "This API is to post barcode deactivate",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["outlet_id", "is_missed"],
        properties: {
            outlet_id: { type: "integer" },//false is stock closed
            is_missed: { type: "boolean" }, // true is missed 
            barcode: { type: "string" }
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

module.exports = isMissedBarcodeSchema;
