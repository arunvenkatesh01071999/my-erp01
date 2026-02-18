const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const updateWarehouseSalesReturnSyncSchema = {
    tags: ["SYNC WAREHOUSE SALES RETURN"],
    summary: "Update warehouse sales sync flag and down_time for Warehouse sales details and master",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            opr_doc_no: { type: "string" }
        },
        required: ["opr_doc_no"]
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

module.exports = updateWarehouseSalesReturnSyncSchema;
