const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getWarehouseExpenseDatewiseSchema = {
    tags: ["WAREHOUSE"],
    summary: "Get Warehouse Expenses List",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        required: ["from_date", "to_date"],
        additionalProperties: false,
        properties: {
            from_date: { type: "string", format: "date" },
            to_date: { type: "string", format: "date" },
            page_size: { type: "integer", default: 10 },
            current_page: { type: "integer", default: 1 }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        required: [
                            "id",
                            "doc_no",
                            "doc_date",
                            "warehouse_id",
                            "account_id",
                            "amount",
                            "remarks",
                            "account_name",
                            "warehouse_name",
                            "warehouse_expenses_details"
                        ],
                        properties: {
                            id: { type: "integer" },
                            doc_no: { type: "string" },
                            doc_date: { type: "string", format: "date" },
                            warehouse_id: { type: "integer" },
                            warehouse_name: { type: "string" },
                            account_name: { type: "string" },
                            account_id: { type: "integer" },
                            amount: { type: "number" },
                            remarks: { type: "string" },
                            warehouse_expenses_details: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: { type: "integer" },
                                        doc_no: { type: "string" },
                                        doc_date: { type: "string", format: "date" },
                                        expenses_mst_id: { type: "integer" },
                                        warehouse_id: { type: "integer" },
                                        account_id: { type: "integer" },
                                        account_name: { type: "string" },
                                        sub_account_id: { type: "integer" },
                                        sub_account_name: { type: "string" },
                                        amount: { type: "number" }
                                    },
                                    additionalProperties: false
                                }
                            }
                        },
                        additionalProperties: false
                    }
                },
                meta: {
                    type: "object",
                    properties: {
                        pagination: {
                            type: "object",
                            properties: {
                                total: { type: "integer" },
                                page: { type: "integer" },
                                page_size: { type: "integer" },
                                total_pages: { type: "integer" }
                            }
                        }
                    }
                }
            }
        },

        ...errorSchemas
    }
};

module.exports = getWarehouseExpenseDatewiseSchema

