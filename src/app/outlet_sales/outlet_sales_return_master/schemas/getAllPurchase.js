const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const responseSchema = {
  200: {
    type: "array",
    items: {
      type: "object",
      properties: {
        id: { type: "integer" },
        docno: { type: "string" },
        docdate: { type: "string", format: "date-time" },
        outletid: { type: "integer" },
        prodid: { type: "integer" },
        dis_per: { type: "string" },
        dis_amt: { type: "string" },
        mrp: { type: "string" },
        rate: { type: "string" },
        qty: { type: ["number", "null"] }, // Assuming qty can be a number or null
        gst_per: { type: "string" },
        gst_amt: { type: "string" },
        cess_per: { type: "string" },
        cess_amt: { type: "string" },
        barcode: { type: "string" },
        company_id: { type: "integer" },
        head_id: { type: "integer" },
        type_id: { type: "integer" },
        subcat_id: { type: "integer" },
        cat_id: { type: "integer" },
        uom_id: { type: "integer" },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
        created_by: { type: "integer" },
        updated_by: { type: ["integer", "null"] }, // Assuming updated_by can be null
        // Include other properties as needed
      },
    },
  },
  ...errorSchemas,
};

module.exports = responseSchema;


