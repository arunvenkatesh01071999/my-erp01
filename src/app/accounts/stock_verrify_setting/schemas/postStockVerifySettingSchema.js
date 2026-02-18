const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postStockVerifySettingSchema = {
    tags: ["StockVerifySetting"],
    summary: "This API is to post StockVerifySetting",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["is_verify"],
        properties: {
            is_verify: { type: "boolean" },

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

module.exports = postStockVerifySettingSchema;
