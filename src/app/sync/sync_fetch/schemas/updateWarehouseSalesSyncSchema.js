const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const updateWarehouseSalesSyncSchema = {
    tags: ["SYNC WAREHOUSE SALES"],
    summary: "Update warehouse sales sync flag and down_time for Warehouse sales details and master",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            op_doc_no: { type: "string" }
        },
        required: ["op_doc_no"]
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

module.exports = updateWarehouseSalesSyncSchema;
