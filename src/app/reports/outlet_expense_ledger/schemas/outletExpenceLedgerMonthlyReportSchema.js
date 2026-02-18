const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const expenceLedgerMonthlyReportSchema = {
    tags: ["Expense Ledger"],
    summary: "Expense ledger monthly report schema",
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    date: { type: "string" },
                    account_name: { type: "string" },
                    no_of_acc_id: { type: "string" },
                    amount: { type: "string" }
                }
            }
        }
    }
};

module.exports = expenceLedgerMonthlyReportSchema;


