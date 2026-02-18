const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getAllSalesSchema = {
    type: "array",
    items: {
        type: "object",
        properties: {
            id: { type: "integer" },
            docno: { type: "string" },
            docdate: { type: "string", format: "date-time" },
            sales_mst_id: { type: "integer" },
            prodid: { type: "integer" },
            dis_per: { type: "string" },
            dis_amt: { type: "string" },
            mrp: { type: "string" },
            rate: { type: "string" },
            qty: { type: "integer" },
            gst_per: { type: "string" },
            gst_amt: { type: "string" },
            cess_per: { type: "string" },
            cess_amt: { type: "string" },
            barcode: { type: "string" },
            company_id: { type: "integer" },
            created_at: { type: "string" },
            updated_at: { type: "string" },
            created_by: { type: "integer" },
            updated_by: { type: "integer" },
            head_id: { type: "integer" },
            type_id: { type: "integer" },
            subcat_id: { type: "integer" },
            cat_id: { type: "integer" },
            uom_id: { type: "integer" },
            igst_per: { type: "string" },
            barcode_to: { type: "string" },
            partycode: { type: "integer" },
            mode: { type: "string" },
            pro_name: { type: "string" },
            description: { type: "string" },
            pro_code: { type: "string" },

        },

    },
};

module.exports = { getAllSalesSchema }
