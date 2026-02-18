const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const updatePoSyncSchema = {
    tags: ["SYNCGRN"],
    summary: "Update Grn sync flag and down_time for Grn details and master",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            grn_no: { type: "string" },
            outlet_id: { type: "integer" },
        },
        required: ["grn_no", "outlet_id"]
    },
    body: {
        type: "object",
        required: ["flag", "outlet_grn_no"],
        properties: {
            flag: { type: "integer", enum: [1] },
            outlet_grn_no: { type: "string" }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                success: { type: "boolean" },
                message: { type: "string" },
            }
        },
        ...errorSchemas
    }
};

module.exports = updatePoSyncSchema;
