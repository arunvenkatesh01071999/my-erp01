const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getIssueTransferTempDetailsSchema = {
    tags: ["Sales"],
    summary: "This API retrieves sales details including total quantity.",
    headers: { $ref: "request-headers#" },
    response: {
        200: {
            type: "object",  // Response is an object with `data` and `totalQty`
            properties: {
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "integer" },
                            docdate: { type: "string" },
                            address: { type: "string" },
                            amount: { type: "number" },
                            barcode_from: { type: "string" },
                            barcode_to: { type: "string" },
                            dis_per: { type: "number" },
                            docno: { type: "string" },
                            gst_amt: { type: "number" },
                            gst_in: { type: ["string", "null"] },
                            gst_per: { type: "number" },
                            mode: { type: "string" },
                            mrp: { type: "number" },
                            outlet_id: { type: "integer" },
                            prod_id: { type: "integer" },
                            qty: { type: "number" },
                            sale_rate: { type: "string" },
                            updated_at: { type: "string" },
                            outlet_code: { type: "string" },
                            outlet_shortname: { type: "string" },
                            outlet_fullname: { type: "string" },
                            pro_code: { type: "string" },
                            pro_name: { type: "string" },
                            cat_id: { type: "integer" },
                            head_id: { type: "integer" },
                            uom: { type: "integer" },
                            type: { type: "integer" },
                            sub_cat: { type: "integer" },
                            company_id: { type: "integer" },
                            cess: { type: "number" },
                            hsn: { type: "number" },
                            gst: { type: "number" },
                        }
                        // required: ["id", "docdate", "amount", "docno", "outlet_id", "prod_id", "qty", "sale_rate"],
                    },
                },
                totalQty: { type: "integer" },
            },
        },
        ...errorSchemas,
    },
};

module.exports = getIssueTransferTempDetailsSchema;
