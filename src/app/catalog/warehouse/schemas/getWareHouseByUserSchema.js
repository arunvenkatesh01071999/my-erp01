const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getWareHouseByUserSchema = {
  tags: ["WAREHOUSE BY USER"],
  summary: "This API is to get Consumer",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          warehouse_name: { type: "string" },
          short_name: { type: "string" },
          add1: { type: "string" },
          add2: { type: "string" },
          add3: { type: "string" },
          add4: { type: "string" },
          city_name: { type: "string" },
          city_id: { type: "integer" },
          pincode: { type: "string" },
          state_name: { type: "string" },
          state_id: { type: "integer" },
          country_name: { type: "string" },
          country_id: { type: "integer" },
          phone: { type: "string" },
          mobile: { type: "string" },
          email: { type: "string" },
          company_id: { type: "integer" },
          is_active: { type: "boolean" },
          limitation: { type: "string" }, // Changed from number to string
          gstin: { type: "string" },
          fssai: { type: "string" },
          bankacno: { type: "string" },
          bankname: { type: "string" },
          acname: { type: "string" },
          ifsccode: { type: "string" },
          is_gst: { type: "boolean" },
          wallet_balance: { type: "string" }, // Changed from number to string
          main_warehouse: { type: "boolean" },
          contact_name: { type: "string" },
          created_at: { type: "string", format: "date-time" }, // Added missing field
          updated_at: { type: "string", format: "date-time" }, // Added missing field
          created_by: { type: ["integer", "null"] }, // Added missing field
          updated_by: { type: ["integer", "null"] } // Added missing field
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getWareHouseByUserSchema;
