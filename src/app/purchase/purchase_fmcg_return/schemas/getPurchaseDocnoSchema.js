const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getPurchaseDocNo = {
  tags: ["Item INFO"],
  summary: "This API is to get Item Info",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
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
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
          created_by: { type: "integer" },
          updated_by: { type: ["integer", "null"] },
          head_id: { type: "integer" },
          type_id: { type: "integer" },
          subcat_id: { type: "integer" },
          cat_id: { type: "integer" },
          uom_id: { type: "integer" },
          igst_per: { type: "string" },
          barcode_to: { type: "string" },
          partycode: { type: "integer" },
          mode: { type: "string" },
          pro_name: { type: ["string", "null"] },
          description: { type: ["string", "null"] },
          pro_code: { type: ["string", "null"] },
          original_qty: { type: "string" },
          is_barcode_generated: { type: "integer" },
          is_barcode_generated_list: { type: "integer" },

        },
        // required: ["id", "docno", "docdate", "sales_mst_id", "prodid", "dis_per", "dis_amt", "mrp", "rate", "qty", "gst_per", "gst_amt", "cess_per", "cess_amt", "barcode", "company_id", "created_at", "updated_at", "created_by", "head_id", "type_id", "subcat_id", "cat_id", "uom_id", "igst_per", "barcode_to", "partycode", "mode", "original_qty"]
      }
    },
    ...errorSchemas
  }
};

module.exports = getPurchaseDocNo;
