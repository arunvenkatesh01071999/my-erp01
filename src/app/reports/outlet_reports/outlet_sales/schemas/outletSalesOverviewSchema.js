const { errorSchemas } = require("../../../../commons/schemas/errorSchemas");

const outletSalesOverviewSchema = {
    tags: ["ORDERS"],
    summary: "This API is to get year sales",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        required: ["outletid", "date"],
        properties: {
            outletid: { type: "integer" },
            date: { type: "string" },
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                total_invoices: { type: "number" },
                total_sales: { type: "number" },
                total_card: { type: "number" },
                total_cash: { type: "number" },
                total_upi: { type: "number" },
                total_return: { type: "number" },
                total_return_used: { type: "number" },
                total_loyalty: { type: "number" },
                total_return_count: { type: "number" },
                total_less_amount: { type: "number" },
                dinominationDetails: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            total: { type: "number" },
                            amount_be_deposited: { type: "number" },
                            next_day_balance: { type: "number" },
                            closing_cash_lines: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        date: { type: "string" },
                                        denomination: { type: "integer" },
                                        count: { type: "integer" },
                                        total: { type: "number" },
                                    },
                                },
                            }
                        },
                    },
                },
            }
        },
        ...errorSchemas
    }
};


module.exports = outletSalesOverviewSchema;
