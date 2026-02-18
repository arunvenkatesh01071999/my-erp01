const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const stockLedgerSchema = {
    tags: ["Stock Ledger"],
    summary: "This API is to get stock ledger report",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["from_date", "to_date", "category"],
        additionalProperties: false,
        properties: {
            from_date: { type: "string", format: "date" },
            to_date: { type: "string", format: "date" },
            category: { type: "integer" }
        }
    },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    pro_code: { type: "string" },
                    pro_name: { type: "string" },
                    units_short_name: { type: "string" },
                    pur_rate: { type: "number" },
                    purchase: { type: "number" },
                    sales: { type: "number" },
                    purchasereturn: { type: "number" },
                    waste: { type: "number" },
                    adjust: { type: "number" },
                    free: { type: "number" },
                    inqty: { type: "number" },
                    salesreturn: { type: "number" },
                    tr_in_qty: { type: "number" },
                    tr_out_qty: { type: "number" },
                    openqty: { type: "number" },
                    closing: { type: "number" },
                    balance: { type: "number" }

                }
            }
        },
        ...errorSchemas
    }
};

module.exports = stockLedgerSchema;
