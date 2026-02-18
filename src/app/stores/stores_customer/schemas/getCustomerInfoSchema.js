const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getCustomerInfoSchema = {
  tags: ["CUSTOMER INFO"],
  summary: "This API is to get customer Info",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      customer_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {

        id: { type: "integer" },
        customer_code: { type: "string" },
        name: {
          type: "string",
        },
        short_name: {
          type: "string",
        },
        group_id: { type: "integer" },
        allocate_group: { type: "integer" },

        address1: { type: "string" },
        address2: { type: "string" },

        country_id: { type: "integer" },
        country_name: { type: "string" },
        state_id: { type: "integer" },
        state_name: { type: "string" },
        city_id: { type: "integer" },
        city_name: { type: "string" },
        state_code: { type: "integer" },

        pincode: { type: "integer" },

        phone: { type: "string" },
        mobile: { type: "string" },

        email: { type: "string" },
        website: { type: "string" },

        gstin: { type: "string" },
        cst: { type: "string" },

        pan_number: { type: "string" },

        opening_balance: { type: "number" },
        balance: { type: "number" },

        web_id: { type: "integer" },
        location_id: { type: "integer" },
        warehouse_id: { type: "integer" },

        export: { type: "number" },
        sales_margin: { type: "number" },

        customer_type: { type: "integer" },
        gst_type: { type: "integer" },

        default_cash_sales: { type: "integer" },
        web_order: { type: "integer" },
        web_sales_export: { type: "integer" },
        bulk_sales: { type: "integer" },
        grocery_tray: { type: "integer" },
        margin_active: { type: "integer" },

        delivery_address1: { type: "string" },
        delivery_address2: { type: "string" },
        delivery_country_id: { type: "integer" },
        delivery_country_name: { type: "string" },

        delivery_state_id: { type: "integer" },
        delivery_state_name: { type: "string" },

        delivery_city_id: { type: "integer" },
        delivery_city_name: { type: "string" },

        delivery_pincode: { type: "integer" },
        delivery_state_code: { type: "integer" },

        status: { type: "integer" },

        is_active: { type: "boolean" },

        company_id: { type: "integer" },
        user_id: { type: "integer" },
        wh_id: { type: "integer" },
      },
    },
    ...errorSchemas
  }
};

module.exports = getCustomerInfoSchema;
