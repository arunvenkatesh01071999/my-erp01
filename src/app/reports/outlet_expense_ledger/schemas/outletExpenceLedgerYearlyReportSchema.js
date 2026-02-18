const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const expenceLedgerYearlyReportSchema = {
    tags: ["Expense Ledger"],
    summary: "Expense ledger yearly report schema",
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    month: { type: "string" },
                    month_number: { type: "string" },
                    year: { type: "string" },
                    no_of_acc_id: { type: "string" },
                    amount: { type: "string" }
                }
            }
        }
    }
};

module.exports = expenceLedgerYearlyReportSchema;


