const { errorSchemas } = require("../../../../commons/schemas/errorSchemas");

const gstHsnLedgerOutletSalesReportWithDateSchema = {
    tags: ["HSN Gst OutletSales Ledger Report"],
    summary: "This API is to get hsn gst ledger report",
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
                            hsn: { type: "string" },
                            amount: { type: "number" },
                            qty: { type: "number" },
                            gst_amt: { type: "number" },
                            igst_amt: { type: "number" },
                            cess_amt: { type: "number" }
                        }
                    }
                },
                outlet_sales: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            docdate: { type: "string" },
                            docno: { type: "string" },
                            hsn: { type: "string" },
                            amount: { type: "number" },
                            gst_per: { type: "number" },
                            qty: { type: "number" },
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

module.exports = gstHsnLedgerOutletSalesReportWithDateSchema;
