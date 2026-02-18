const { errorSchemas } = require("../../../../commons/schemas/errorSchemas");


const outletSalesReportSchema = {
  tags: ["outlet Sales Report"],
  summary: "This API is to get outlet sales report",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["from_date", "to_date", "customer"],
    additionalProperties: false,
    properties: {
      from_date: { type: "string", format: "date" },
      to_date: { type: "string", format: "date" },
      customer: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties:
        {

          id: { type: 'integer' },
          docno: { type: 'string' },
          docdate: { type: 'string', format: 'date-time' },
          outletid: { type: 'integer' },
          subtotal_amount: { type: 'number' },
          gst_per: { type: 'number' },
          gst_amt: { type: 'number' },
          cess_per: { type: 'number' },
          cess_amt: { type: 'number' },
          roff: { type: 'number' },
          is_credit: { type: 'integer' },
          outstanding: { type: 'number' },
          mode: { type: 'string' },
          company_id: { type: 'integer' },
          mobile: { type: 'string', pattern: '^[0-9]{10,12}$' },
          party_name: { type: 'string' },
          address: { type: 'string' },
          gst_in: { type: 'string' },
          salesman_id: { type: 'integer' },
          loyalty_earned: { type: 'number' },
          balance_points: { type: 'number' },
          upi_amount: { type: 'number' },
          cash_amount: { type: 'number' },
          card_amount: { type: 'number' },
          return_billno: { type: 'string' },
          transaction_id: { type: 'string' },
          transaction_provider: { type: 'integer' },
          transaction_type: { type: 'integer' },
          discount_amount: { type: "number" },
          fullname: { type: 'string' },
          short_name: { type: 'string' },
          code: { type: 'string' },
          add1: { type: 'string' },
          add2: { type: 'string' },
          add4: { type: 'string' },
          city: { type: 'integer' },
          pincode: { type: 'string' },
          state: { type: 'integer' },
          country: { type: 'integer' },
          phone: { type: 'string', pattern: '^[0-9]{10,12}$' },
          outlet_mobile: { type: 'string', pattern: '^[0-9]{10,12}$' },
          email: { type: 'string', format: 'email' },
          website: { type: 'string', format: 'uri' },
          gstin: { type: 'string' },
          fssai: { type: 'string' },
          outlet_type: { type: 'integer' },
          bankacno: { type: 'string' },
          bankname: { type: 'string' },
          acname: { type: 'string' },
          ifsccode: { type: 'string' },
          is_gst: { type: 'boolean' },
          outlet_type_name: { type: 'string' },
          state_name: { type: 'string' },
          city_name: { type: 'string' },
          country_name: { type: 'string' },
          sales_man_code: { type: 'string' },
          sales_man_name: { type: 'string' },
          sales_man_short_name: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
          created_by: { type: ['integer', 'null'] },
          updated_by: { type: ['integer', 'null'] },
          amount: { type: 'number' },
          return_amount: { type: 'number' },
          less_amount: { type: "number" },
          loyalty_redem: { type: 'number' },
          final_total: { type: 'number' },
          outletSales_lines: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                docno: { type: 'string' },
                docdate: { type: 'string', format: 'date-time' },
                outletid: { type: 'integer' },
                prodid: { type: 'integer' },
                dis_per: { type: 'number' },
                dis_amt: { type: 'number' },
                mrp: { type: 'number' },
                rate: { type: 'number' },
                qty: { type: 'number' },
                gst_per: { type: 'number' },
                gst_amt: { type: 'number' },
                cess_per: { type: 'number' },
                cess_amt: { type: 'number' },
                barcode: { type: 'string' },
                company_id: { type: 'integer' },
                created_at: { type: 'string' },
                updated_at: { type: 'string' },
                created_by: { type: ['integer', 'null'] },
                updated_by: { type: ['integer', 'null'] },
                igst_per: { type: 'number' },
                pro_name: { type: ['string', 'null'] },
                pro_code: { type: ['string', 'null'] },
                hsn: { type: 'string' },
                units_short_name: { type: ['string', 'null'] },
                head_name: { type: ['string', 'null'] },
                type_name: { type: ['string', 'null'] },
                category_name: { type: ['string', 'null'] },
                subcategory_name: { type: ['string', 'null'] }

              }
            }
          }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = outletSalesReportSchema;
