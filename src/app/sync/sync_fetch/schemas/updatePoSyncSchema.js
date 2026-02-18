const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const updatePoSyncSchema = {
    tags: ["SYNCPO"],
    summary: "Update PO sync flag and down_time for PO details and master (transactional)",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            po_no: { type: "string" },
            outlet_id: { type: "integer" },
        },
        required: ["po_no", "outlet_id"]
    },
    body: {
        type: "object",
        required: ["flag", "outlet_po_no"],
        properties: {
            flag: { type: "integer", enum: [1] },
            outlet_po_no: { type: "string" }
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
