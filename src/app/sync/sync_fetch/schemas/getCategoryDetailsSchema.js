const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getCategoryDetailsSchema = {
    tags: ["CATEGORY"],
    summary: "This API is to fetch category",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            id: { type: "integer" },
        },
    },
    response: {
        200: {
            type: "object",
            properties: {
                status: { type: "string", },
                message: {
                    oneOf: [
                        {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    CM_id: { type: "string" },
                                    CM_name: { type: "string" },
                                    CM_UID: { type: "string" },
                                    CM_MID: { type: "string" },
                                    Active: { type: "string", enum: ["1"] },
                                    CM_Parent: { oneOf: [{ type: "string" }, { type: "integer" }] },
                                    OOS: { type: "string" },
                                },

                            },
                        },
                        {
                            type: "string"
                        }
                    ]
                },
            },
            required: ["status", "message"],
        },
        ...errorSchemas,
    },
};

module.exports = getCategoryDetailsSchema;
