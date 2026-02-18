const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const skuPriceUploadSchema = {
    tags: ["OUTLET PRODUCT"],
    summary: "This API is to Update margin & discount values in outlet product",
    headers: { $ref: "request-headers#" },
    consumes: ["multipart/form-data"],
    body: {
        type: "object",
        required: ["outlet_id"],
        properties: {
            outlet_id: {
                description: "Outlet IDs (comma separated or form-data)",
                anyOf: [
                    { type: "string" },
                    { type: "object" }
                ]
            }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                success: { type: "boolean" },
                message: { type: "string" },

                // -------------------------
                // SUMMARY LIST
                // -------------------------
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            outlet_id: { type: "integer" },
                            total_count: { type: "integer" },
                            success_count: { type: "integer" },
                            missed_count: { type: "integer" }
                        },
                        required: ["outlet_id", "total_count", "success_count", "missed_count"]
                    }
                },

                // -------------------------
                // UNAPPROVED PO DETAILS
                // -------------------------
                unApprovedPurchaseOrderDetail: {
                    type: "array",
                    description: "Contains unapproved PO details grouped by outlet",
                    items: {
                        type: "object",
                        properties: {
                            po_no: { type: "string" },
                            po_date: { type: "string", format: "date-time" },
                            supplier_id: { type: "integer" },
                            supplier_name: { type: "string" },
                            outlet_id: { type: "integer" },
                            outlet_name: { type: "string" },
                            brand_company_id: { type: "integer" },
                            brand_company_name: { type: "string" },
                            productDetails: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        prod_code: { type: "string" },
                                        mrp: { type: "string" }
                                    },
                                    required: ["prod_code", "mrp"]
                                }
                            }
                        },
                        required: [
                            "po_no",
                            "po_date",
                            "supplier_id",
                            "supplier_name",
                            "outlet_id",
                            "outlet_name",
                            "brand_company_id",
                            "brand_company_name",
                            "productDetails"
                        ]
                    }
                },

                // -------------------------
                // PENDING PURCHASE MEMO
                // -------------------------
                pendingPurchaseMemo: {
                    type: "array",
                    description: "Contains unapproved Purchase Memo details grouped by outlet",
                    items: {
                        type: "object",
                        properties: {
                            po_no: { type: "string" },
                            po_date: { type: "string", format: "date-time" },
                            supplier_id: { type: "integer" },
                            supplier_name: { type: "string" },
                            outlet_id: { type: "integer" },
                            outlet_name: { type: "string" },
                            brand_company_id: { type: "integer" },
                            brand_company_name: { type: "string" },
                            productDetails: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        prod_code: { type: "string" },
                                        mrp: { type: "string" }
                                    },
                                    required: ["prod_code", "mrp"]
                                }
                            }
                        },
                        required: [
                            "po_no",
                            "po_date",
                            "supplier_id",
                            "supplier_name",
                            "outlet_id",
                            "outlet_name",
                            "brand_company_id",
                            "brand_company_name",
                            "productDetails"
                        ]
                    }
                }
            }
        },
        ...errorSchemas
    }
};

module.exports = skuPriceUploadSchema;
