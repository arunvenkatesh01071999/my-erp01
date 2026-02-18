const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getStockVerifySettingInfoSchema = {
    tags: ["ROLE"],
    summary: "This API is to get roles",
    headers: { $ref: "request-headers#" },
    response: {
        200: {
            type: "object",
            properties: {

                id: { type: "integer" },
                is_verify: { type: "boolean" },

            }
        },
        ...errorSchemas
    }
};

module.exports = getStockVerifySettingInfoSchema;
