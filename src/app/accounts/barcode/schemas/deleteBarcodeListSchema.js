const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteBarcodeListSchema = {
    tags: ["DELETE USERS"],
    summary: "This API is to delete users",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            barcode_id: { type: "integer" }
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

module.exports = deleteBarcodeListSchema;
