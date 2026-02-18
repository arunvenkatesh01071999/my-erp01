const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postOutletToOutletTransferMasterSchema = {
    tags: ["postOutletToOutletTransferMaster"],
    summary: "This API is to postOutletToOutletTransferMaster",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["from_outlet_id", "to_outlet_id"],
        properties: {
            status: { type: "string" },
            from_outlet_id: { type: "integer" },
            to_outlet_id: { type: "integer" },
            docno: { type: "string" },
            docdate: { type: "string" },
            user_id: { type: "integer" },
            outletid: { type: "integer" },
            amount: { type: "number" },
            subtotal_amount: { type: "number" },
            gst_per: { type: "number" },
            gst_amt: { type: "number" },
            cess_per: { type: "number", },
            cess_amt: { type: "number" },
            roff: { type: "number" },
            is_credit: { type: "integer" },
            company_id: { type: "integer" },
            is_owned: { type: "boolean" },   // true      or     false
            is_approved: { type: "boolean" }, // true      or     false
            is_approved_date: { type: "string" },
            is_approved_by: { type: "string" },
            outlet_to_outlet_details: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        outlet_to_outlet_transfer_master_id: { type: "integer" },
                        from_outlet_id: { type: "integer" },
                        to_outlet_id: { type: "integer" },
                        docno: { type: "string" },
                        docdate: { type: "string" },
                        outletid: { type: "integer" },
                        prodid: { type: "integer" },
                        dis_per: { type: "number" },
                        dis_amt: { type: "number" },
                        mrp: { type: "number" },
                        rate: { type: "number" },
                        qty: { type: "number" },
                        gst_per: { type: "number" },
                        gst_amt: { type: "number" },
                        cess_per: { type: "number" },
                        cess_amt: { type: "number" },
                        barcode: { type: "string" },
                        company_id: { type: "integer" },
                        head_id: { type: "integer" },
                        type_id: { type: "integer" },
                        subcat_id: { type: "integer" },
                        cat_id: { type: "integer" },
                        uom_id: { type: "integer" }
                    },
                },
            },

        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                success: { type: "boolean" }
            }
        },
        ...errorSchemas
    }
};


module.exports = {
    postOutletToOutletTransferMasterSchema,

}

