const postStockCorrectionSchema = {
    tags: ["Stock"],
    summary: "Post Stock Correction",
    headers: { $ref: "request-headers#" },

    body: {
        type: "array",
        items: {
            type: "object",
            properties: {
                prodid: { type: "integer" },
                docdate: { type: "string", format: "date" },
                physical_qty: { type: "number" },
                computer_qty: { type: "number" },
                purchase_rate: { type: "number" },
                sales_rate: { type: "number" },
                mrp: { type: "number" }
            },
            required: [
                "prodid",
                "docdate",
                "physical_qty",
                "computer_qty",
                "purchase_rate",
                "sales_rate",
                "mrp"
            ],
        }
    }
};

module.exports = postStockCorrectionSchema;
