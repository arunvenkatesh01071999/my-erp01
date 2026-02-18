const { errorSchemas } = require("../../../../commons/schemas/errorSchemas");

const outletSalesCurrentDateDashboardReportSchema = {
    tags: ["outlet Sales Report"],
    summary: "This API is to get outlet sales report outlet-wise within a specified date range",
    headers: { $ref: "request-headers#" },
    querystring: {
        type: "object",
        required: ["fromdate", "todate"],
        additionalProperties: false,
        properties: {
            fromdate: { type: "string", format: "date" },
            todate: { type: "string", format: "date" },
            outletid: { type: "string", enum: ["all", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"], default: "all" },
        },
    },
    response: {
        200: {
            type: "object",
            properties: {
                outletSales: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            total_cash_amount: { type: "string" },
                            total_card_amount: { type: "string" },
                            total_upi_amount: { type: "string" },
                            total_return_amount: { type: "string" },
                            total_amount: { type: "string" },
                            total_invoices: { type: "string" },
                            fullname: { type: "string" },
                            short_name: { type: "string" },
                            code: { type: "string" },
                            average_amount: { type: "number" },
                        },
                        required: [
                            "total_cash_amount",
                            "total_card_amount",
                            "total_upi_amount",
                            "total_return_amount",
                            "total_amount",
                            "total_invoices",
                            "fullname",
                            "short_name",
                            "code",
                            "average_amount",
                        ],
                    },
                },
                overallTotals: {
                    type: "object",
                    properties: {
                        total_cash_amount: { type: "number" },
                        total_card_amount: { type: "number" },
                        total_upi_amount: { type: "number" },
                        total_amount: { type: "number" },
                        total_return_amount: { type: "number" },
                        total_invoices: { type: "number" },
                        total_average: { type: "number" },
                    },
                },
            },
            required: ["outletSales", "overallTotals"],
        },
        ...errorSchemas,
    },
};

module.exports = outletSalesCurrentDateDashboardReportSchema;
