const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postBarcodeSettingSchema = {
    tags: ["Barcode Config"],
    summary: "This API is to post barcode config",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["is_individual", "company_id"],
        properties: {
            is_individual: { type: "integer" },
            company_id: { type: "integer" }
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

module.exports = postBarcodeSettingSchema;
