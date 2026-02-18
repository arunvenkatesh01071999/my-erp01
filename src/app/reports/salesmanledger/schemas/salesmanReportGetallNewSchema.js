const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const salesmanReportGetallNewSchema = {
    tags: ["Sales Report"],
    summary: "This API is to get sales report",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["from_date", "to_date"],
        additionalProperties: false,
        properties: {
            from_date: { type: "string", format: "date" },
            to_date: { type: "string", format: "date" },
            outlet: { type: "integer" },
            salesman: { type: "integer" },
        }
    },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    fullname: { type: "string" },
                    total_bill: { type: "string" },
                    total_amount: { type: "string" },
                    avg_amount: { type: "string" },
                    salesman_lines: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                sales_man_code: { type: "string" },
                                sales_man_name: { type: "string" },
                                total_bill: { type: "string" },
                                total_amount: { type: "string" },
                                salesman_avg_amount: { type: "string" },
                            }
                        }
                    }
                }
            }
        },
        ...errorSchemas
    }
};

module.exports = salesmanReportGetallNewSchema;
