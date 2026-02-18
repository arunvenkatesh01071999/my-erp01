const { errorSchemas } = require("../../../../commons/schemas/errorSchemas");

const allOutletsSalesSchema = {
    tags: ["All Outlets sales reports"],
    summary: "This API is to get all Outlets sales reports",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            from_year: {
                type: "string",
                pattern: "^[0-9]{4}$" // Regular expression for 4-digit year format
            },
            to_year: {
                type: "string",
                pattern: "^[0-9]{4}$" // Regular expression for 4-digit year format
            },
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                total_no_of_bills: { type: "integer" },
                total_amount: { type: "number" },
                details: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            outlet_id: { type: "integer" },
                            code: { type: "string" },
                            short_name: { type: "string" },
                            fullname: { type: "string" },
                            bills: { type: "integer" },
                            total: { type: "number" },
                            total_cash_amount: { type: "number" },
                            total_card_amount: { type: "number" },
                            total_upi_amount: { type: "number" },
                            total_return_amount: { type: "number" },
                            total_amount: { type: "number" },
                            total_invoices: { type: "integer" },
                            outlet_fullname: { type: "string" },
                            outlet_shortname: { type: "string" },
                            outlet_code: { type: "string" }
                        },
                        required: [
                            "outlet_id",
                            "code",
                            "short_name",
                            "fullname",
                            "bills",
                            "total",
                            "total_cash_amount",
                            "total_card_amount",
                            "total_upi_amount",
                            "total_return_amount",
                            "total_amount",
                            "total_invoices",
                            "outlet_fullname",
                            "outlet_shortname",
                            "outlet_code"
                        ]
                    }
                }
            },
            required: ["total_no_of_bills", "total_amount", "details"]
        },
        ...errorSchemas
    }
};

module.exports = allOutletsSalesSchema;
