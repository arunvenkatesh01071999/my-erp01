const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postIssueTransferTempSchema = {
    tags: ["IssueTransferTemp"],
    summary: "This API is to post IssueTransferTemp",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["outlet_id", "docno", "docdate", "barcode_from"],
        properties: {
            outlet_id: { type: "integer" },
            docno: { type: "string" },
            docdate: { type: "string" },
            mode: { type: "string" },
            address: { type: "string" },
            gst_in: { type: "string" },
            barcode_from: { type: "string" },
            barcode_to: { type: "string" },
            prod_id: { type: "integer" },
            mrp: { type: "number" },
            dis_per: { type: "number" },
            gst_per: { type: "number" },
            gst_amt: { type: "number" },
            sale_rate: { type: "number" },
            qty: { type: "number" },
            amount: { type: "number" }

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

module.exports = postIssueTransferTempSchema;