const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const gstLedgerReportSchema = {
    tags: ["Gst Ledger Report"],
    summary: "This API is to get gst ledger report",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["from_date", "to_date"],
        additionalProperties: false,
        properties: {
            from_date: { type: "string", format: "date" },
            to_date: { type: "string", format: "date" }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                purchase: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            gst_per: { type: "number" },
                            amount: { type: "number" },
                            gst_amt: { type: "number" },
                            igst_amt: { type: "number" },
                            cess_amt: { type: "number" }
                        }
                    }
                },
                sales: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            gst_per: { type: "number" },
                            amount: { type: "number" },
                            gst_amt: { type: "number" },
                            igst_amt: { type: "number" },
                            cess_amt: { type: "number" }
                        }
                    }
                }
            }
        },
        ...errorSchemas
    }
};

module.exports = gstLedgerReportSchema;
