const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const updatePurchaseReturnSyncSchema = {
    tags: ["SYNC PURCHASE RETURN"],
    summary: "Update Purchase Return sync flag and down_time for Return details and master",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            doc_no: { type: "string" },
            outlet_id: { type: "integer" },
            outlet_purchase_no: { type: "string" }
        },
        required: ["doc_no", "outlet_id", "outlet_purchase_no"]
    },
    body: {
        type: "object",
        required: ["flag", "outlet_purchase_return_no"],
        properties: {
            flag: { type: "integer", enum: [1] },
            outlet_purchase_return_no: { type: "string" }
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

module.exports = updatePurchaseReturnSyncSchema;
