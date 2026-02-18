const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postOutletSalesMasterSchema = {
  tags: ["OutletSalesMaster"],
  summary: "This API is to post OutletSalesMaster",
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
      mode: {
        type: "string",
        enum: ["cash", "upi", "card"] // Enum constraint for mode field
      },
      is_credit: { type: "integer" },
      company_id: { type: "integer" },
      mobile: { type: "string" },
      party_name: { type: "string" },
      address: { type: "string" },
      gst_in: { type: "string" },
      loyalty_earned: { type: "number" },
      loyalty_redem: { type: "number" },
      balance_points: { type: "number" },
      return_amount: { type: "number" },
      return_billno: { type: "string" },
      less_amount: { type: "number" },
      discount_amount: { type: "number" },
      outlet_sales_details: {
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
            igst_per: { type: "number" },
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

const getOutletSalesMasterSchema = {
  tags: ["OutletSalesMaster"],
  summary: "This API is to post OutletSalesMaster",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["code", "outlet_id"],
    properties: {
      code: { type: "string" },
      outlet_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        pro_id: { type: "integer" },
        pro_code: { type: "string" },
        outlet_id: { type: "integer" },
        opng_stock: { type: "string" },
        balnc_stock: { type: "string" },
        company_id: { type: "integer" },
        is_active: { type: "boolean" },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
        created_by: { type: "integer" },
        updated_by: { type: ["integer", "null"] },
        pro_name: { type: "string" },
        type: { type: "integer" },
        sub_cat: { type: "integer" },
        uom: { type: "integer" },
        head_id: { type: "integer" },
        cat_id: { type: "integer" },
        barcode: { type: "string" },
        pur_rate: { type: "string" },
        sale_rate: { type: "string" },
        wholesale_rate: { type: "string" },
        mrp: { type: "string" },
        gst: { type: "string" },
        cess: { type: "string" },
        hsn: { type: "string" },
        op_stk: { type: "string" },
        balance: { type: "string" },
        min_stock: { type: "string" },
        allow_neg_stk: { type: "boolean" },
        wscale: { type: "boolean" },
        vendor: { type: "integer" },
        units_short_name: { type: "string" },
        cateogory_name: { type: "string" },
        subcategory_name: { type: "string" },
        type_name: { type: "string" },
        category_name: { type: "string" }
      }
    },
    ...errorSchemas
  }
};

const getOutletSalesDocno = {
  tags: ["getOutletSalesDocno"],
  summary: "This API is to get getOutletSalesDocno",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "object",
      properties: {
        Docno: { type: "string" }
      }
    },
    ...errorSchemas
  }
};

const putOutletSalesPaymentSchema = {
  tags: ["OutletSalesMaster"],
  summary: "This API is to post OutletSalesMaster",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["outlet_sales_id", "mode"],
    properties: {
      outlet_sales_id: { type: "integer" },
      upi_amount: { type: "number" },
      cash_amount: { type: "number" },
      card_amount: { type: "number" },
      mode: { type: "string" }

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
  postOutletSalesMasterSchema,
  getOutletSalesMasterSchema,
  getOutletSalesDocno,
  putOutletSalesPaymentSchema
}

