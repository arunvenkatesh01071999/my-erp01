const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postSalesReturnMasterSchema = {
  tags: ["SalesReturnMaster"],
  summary: "This API is to post SalesReturnMaster",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["docdate", "outletid", "amount", "company_id"],
    properties: {
      docno: { type: "string" },
      docdate: { type: "string" },
      salesman_id: { type: "integer" },
      outletid: { type: "integer" },
      amount: { type: "number" },
      subtotal_amount: { type: "number" },
      gst_per: { type: "number" },
      gst_amt: { type: "number" },
      cess_per: { type: "number" },
      cess_amt: { type: "number" },
      roff: { type: "number" },
      billno: { type: "string" },
      // is_credit: { type: "integer" },
      company_id: { type: "integer" },
      mobile: { type: "string" },
      party_name: { type: "string" },
      address: { type: "string" },
      gst_in: { type: "string" },
      discount_amount: { type: "number" },
      outlet_sales_return_details: {
        type: "array",
        items: {
          type: "object",
          properties: {
            docno: { type: "string" },
            docdate: { type: "string" }, // date-time
            prodid: { type: "integer" },
            outletid: { type: "integer" },
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
            uom_id: { type: "integer" },
            igst_per: { type: "number" }
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

const getSalesReturnMasterSchema = {
  tags: ["getSalesReturnMaster"],
  summary: "This API is to get SalesReturnMaster",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      Docno: { type: "string" }
    },
    required: ["Docno"]
  },
  response: {
    200: {
      type: "object",
      properties: {

      }
    },
    ...errorSchemas
  }
};

const getOutletSalesSchema = {
  tags: ["getOutletSalesSchema"],
  summary: "This API is to get getOutletSalesSchema",
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
          salesman_id: { type: "integer" },
          outletid: { type: "integer" },
          amount: { type: "string" },
          subtotal_amount: { type: "string" },
          gst_per: { type: "string" },
          gst_amt: { type: "string" },
          cess_per: { type: "string" },
          cess_amt: { type: "string" },
          roff: { type: "string" },
          is_credit: { type: "integer" },
          outstanding: { type: "string" },
          mode: { type: "string" },
          company_id: { type: "integer" },
          mobile: { type: "string" },
          party_name: { type: "string" },
          address: { type: "string" },
          gst_in: { type: "string" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
          created_by: { type: ["integer", "null"] },
          updated_by: { type: ["integer", "null"] },
          code: { type: "string" },
          short_name: { type: "string" },
          fullname: { type: "string" },
          add1: { type: "string" },
          add2: { type: "string" },
          add3: { type: "string" },
          add4: { type: "string" },
          city: { type: "integer" },
          pincode: { type: "string" },
          state: { type: "integer" },
          country: { type: "integer" },
          phone: { type: "string" },
          email: { type: "string" },
          website: { type: "string" },
          gstin: { type: "string" },
          fssai: { type: "string" },
          outlet_type: { type: "integer" },
          bankacno: { type: "string" },
          bankname: { type: "string" },
          acname: { type: "string" },
          ifsccode: { type: "string" },
          is_active: { type: "boolean" },
          is_gst: { type: "boolean" },
          franchise_type: { type: ["integer", "null"] },
          balance: { type: "string" }
        }
      }
    },
    ...errorSchemas
  }
};


const getAllOutletSalesDocnoSchema = {
  tags: ["getAllOutletSalesDocnoSchema"],
  summary: "This API is to get getAllOutletSalesDocnoSchema",
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
          salesman_id: { type: "integer" },
          outletid: { type: "integer" },
          amount: { type: "string" },
          subtotal_amount: { type: "string" },
          gst_per: { type: "string" },
          gst_amt: { type: "string" },
          cess_per: { type: "string" },
          cess_amt: { type: "string" },
          roff: { type: "string" },
          is_credit: { type: "integer" },
          outstanding: { type: "string" },
          mode: { type: "string" },
          company_id: { type: "integer" },
          mobile: { type: "string" },
          party_name: { type: "string" },
          address: { type: "string" },
          gst_in: { type: "string" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
          created_by: { type: "integer" },
          updated_by: { type: "integer" },
          // Add other properties as needed
        },
      },
    },
    ...errorSchemas
  }
};

const updateOsmBycashBillSchema = {
  tags: ["updateOsmBycashBillSchema"],
  summary: "This API is to updateOsmBycashBillSchema",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["docno", "is_refund",],
    properties: {
      docno: { type: "string" },
      is_refund: { type: "boolean" },
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
  postSalesReturnMasterSchema,
  getSalesReturnMasterSchema,
  getAllOutletSalesDocnoSchema,
  getOutletSalesSchema,
  updateOsmBycashBillSchema
}
