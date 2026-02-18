const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSalesTransferReportSchema = {
    tags: ["Sales All Outlet Type Report"],
    summary: "This API Is To Sales All outlet type Report",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["from_date", "to_date", "customer"],
        additionalProperties: false,
        properties: {
            from_date: { type: "string" },
            to_date: { type: "string" },
            customer: { type: "integer" }
        }
    },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    docdate: { type: "string" },
                    docno: { type: "string" },
                    gst_per: { type: "string" },
                    hsn: { type: "string" },
                    amount: { type: "string" },
                    gst_amt: { type: "string" },
                    qty: { type: "string" },
                    igst_amt: { type: "string" },
                    cess_amt: { type: "string" }
                }
            }
        },
        ...errorSchemas
    }
};

module.exports = getSalesTransferReportSchema;


