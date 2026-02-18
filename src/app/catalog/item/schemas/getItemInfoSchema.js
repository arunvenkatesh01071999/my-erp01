const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getItemInfoSchema = {
  tags: ["Item INFO"],
  summary: "This API is to get Item Info",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      id: { type: "integer" }
    },
    required: ["id"]
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        pro_code: { type: "string" },
        short_name: { type: "string" },
        pro_description: { type: "string" },
        regional_name: { type: "string" },
        pro_name: { type: "string" },
        company_id: { type: "integer" },
        company_name: { type: "string" },
        type_id: { type: "integer" },
        product_type_name: { type: "string" },
        main_category_id: { type: "integer" },
        main_category_name: { type: "string" },
        merchant_category_id: { type: "integer" },
        merchant_category_name: { type: "string" },
        sub_category_id: { type: "integer" },
        sub_category_name: { type: "string" },
        head_id: { type: "integer" },
        head_name: { type: "string" },
        typedesign_id: { type: "integer" },
        type_name: { type: "string" },
        main_uom_id: { type: "integer" },
        uom_id: { type: "integer" },
        uom_name: { type: "string" },
        mrp: { type: "string" },
        pur_rate: { type: "string" },
        sale_rate: { type: "string" },
        wholesale_rate: { type: "string" },
        gst: { type: "string" },
        cess: { type: "string" },
        hsn: { type: "string" },
        op_stk: { type: "string" },
        min_stock: { type: "string" },
        balance: { type: "string" },
        incharge_id: { type: "integer" },
        incharge_name: { type: "string" },
        tray_id: { type: "integer" },
        tray_name: { type: "string" },
        expiry_type_id: { type: "integer" },
        expiry_value: { type: "integer" },
        expiry_name: { type: "string" },
        mbq: { type: "integer" },
        shrinkage: { type: "integer" },
        case_qty: { type: "integer" },
        putaway: { type: "integer" },
        putaway_name: { type: "string" },
        bulk_item: { type: "boolean" },
        returnable_item: { type: "boolean" },
        purchase: { type: "boolean" },
        min_stock_warning: { type: "boolean" },
        batch_item: { type: "boolean" },
        outlet_purchase: { type: "boolean" },
        outlet_non_saleable: { type: "boolean" },
        allow_neg_stk: { type: "boolean" },
        gst_inclusive: { type: "boolean" },
        wscale: { type: "boolean" },
        convertion_factor: { type: "string" },
        discount: { type: "string" },
        expiry_date: { type: "string" },
        main_product_id: { type: "integer" },
        main_product_qty: { type: "integer" },
        is_active: { type: "boolean" },
        outlets: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
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
              mobile: { type: "string" },
              email: { type: "string" },
              website: { type: "string" },
              gstin: { type: "string" },
              fssai: { type: "string" },
              outlet_type: { type: "integer" },
              bankacno: { type: "string" },
              bankname: { type: "string" },
              acname: { type: "string" },
              ifsccode: { type: "string" },
              company_id: { type: "integer" },
              is_active: { type: "boolean" },
            },
          },
        },
        barcode: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              prod_id: { type: "integer" },
              product_code: { type: "string" },
              barcode: { type: "string" },
              is_active: { type: "boolean" }
            },
          },
        },
        vendors: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" },
              short_name: { type: "string" },
              company_id: { type: "integer" },
              mobile: { type: "string" },
              phone: { type: "string" },
              add1: { type: "string" },
              city: { type: "integer" },
              pincode: { type: "string" },
              state: { type: "integer" },
              email: { type: "string" },
              website: { type: "string" },
              balance: { type: "string" },
              gstin: { type: "string" },
              is_active: { type: "boolean" },
            },
          },
        },
        pickers: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              picker_name: { type: "string" },
              today_work_status: { type: "integer" }
            },
          },
        }
      },
      company_details: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "integer" },
            code: { type: "string" },
            company_short_name: { type: "string" },
            company_fullname: { type: "string" },
            add1: { type: "string" },
            add2: { type: "string" },
            add3: { type: "string" },
            add4: { type: "string" },
            city: {
              type: "object",
              properties: {
                id: { type: "integer" },
                name: { type: "string" }
              }
            },
            pincode: { type: "string" },
            state: {
              type: "object",
              properties: {
                id: { type: "integer" },
                name: { type: "string" }
              }
            },
            country: {
              type: "object",
              properties: {
                id: { type: "integer" },
                name: { type: "string" }
              }
            },
            phone: { type: "string", pattern: "^[0-9]{10,12}$" },
            mobile: { type: "string", pattern: "^[0-9]{10,12}$" },
            email: { type: "string", format: "email" },
            website: {
              type: "string",
              pattern: "^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w.-]*)*/?$"
            },
            gstin: { type: "string" },
            fssai: { type: "string" },
            is_active: { type: "boolean" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
            created_by: { type: "integer" },
            updated_by: { type: "integer" },
            bank_details: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  bankacno: { type: "string" },
                  bankname: { type: "string" },
                  acname: { type: "string" },
                  ifsccode: { type: "string" },
                  company_id: { type: "integer" },
                  is_active: { type: "boolean" },
                  created_at: { type: "string", format: "date-time" },
                  updated_at: { type: "string", format: "date-time" },
                  created_by: { type: "integer" },
                  updated_by: { type: "integer" }
                }
              }
            }
          }
        }
      }
    }
  }
};

module.exports = getItemInfoSchema;
