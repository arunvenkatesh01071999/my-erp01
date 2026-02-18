const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const updateOutletDebitNoteSyncSchema = {
    tags: ["SYNC OUTLET DEBIT NOTE"],
    summary: "Update Outlet Debit Note sync flag and down_time for Debit Note details and master",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            doc_no: { type: "string" },
            outlet_id: { type: "integer" },
        },
        required: ["doc_no", "outlet_id"]
    },
    body: {
        type: "object",
        required: ["flag", "outlet_debit_note_no"],
        properties: {
            flag: { type: "integer", enum: [1] },
            outlet_debit_note_no: { type: "string" }
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

module.exports = updateOutletDebitNoteSyncSchema;
