const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putPriceUploadSchema = {
    tags: ["OUTLET PRODUCT"],
    summary: "This API is to Update margin & discount values in outlet product",
    headers: { $ref: "request-headers#" },
    consumes: ["multipart/form-data"],

    params: {
        type: "object",
        required: ["company_id"],
        properties: {
            company_id: {
                type: "integer",
                description: "Company ID"
            }
        }
    },

    body: {
        type: "object",
        required: ["purchaseOrderDetails", "purchaseMemoDetails"],
        properties: {
            purchaseOrderDetails: {
                type: "array",
                items: {
                    type: "object",
                    required: ["po_no", "supplier_id", "outlet_id", "productDetails"],
                    properties: {
                        po_no: { type: "string" },
                        supplier_id: { type: "integer" },
                        outlet_id: { type: "integer" },
                        productDetails: {
                            type: "array",
                            items: {
                                type: "object",
                                required: ["prod_code", "mrp"],
                                properties: {
                                    prod_code: { type: "string" },
                                    mrp: { type: "string" }
                                }
                            }
                        }
                    }
                }
            },

            purchaseMemoDetails: {
                type: "array",
                items: {
                    type: "object",
                    required: ["po_no", "supplier_id", "outlet_id", "invoice_no", "productDetails"],
                    properties: {
                        po_no: { type: "string" },
                        supplier_id: { type: "integer" },
                        outlet_id: { type: "integer" },
                        invoice_no: { type: "string" },
                        productDetails: {
                            type: "array",
                            items: {
                                type: "object",
                                required: ["prod_code", "mrp"],
                                properties: {
                                    prod_code: { type: "string" },
                                    mrp: { type: "string" }
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    response: {
        200: {
            type: "object",
            properties: {
                success: { type: "boolean" },
                message: { type: "string" }
            }
        },
        ...errorSchemas
    }
};

module.exports = putPriceUploadSchema;
