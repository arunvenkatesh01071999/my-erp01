const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSyncSupplierInsertUpdateDetailsSchema = {
  tags: ["SYNC SUPPLIER INSERT UPDATE DETAILS"],
  summary: "API to list sync supplier outlet mapping order days",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      outlet_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          outlet_id: { type: "integer" },
          outlet_name: { type: "string" },
          customer_code: { type: "string" },
          supplier_id: { type: "integer" },
          supplier_name: { type: "string" },
          new_code: { type: "string" },
          old_code: { type: "integer" },
          address1: { type: "string" },
          address2: { type: "string" },
          country_name: { type: "string" },
          state_name: { type: "string" },
          city_name: { type: "string" },
          pincode: { type: "string" },
          phone_no: { type: "string" },
          email_id: { type: "string" },
          mobile: { type: "string" },
          gstin: { type: "string" },
          alter_email: { type: "string" },
          bank_ac_no: { type: "string" },
          ifsccode: { type: "string" },
          bankname: { type: "string" },
          fssaino: { type: "string" },
          pan_number: { type: "string" },
          is_active: { type: "boolean" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getSyncSupplierInsertUpdateDetailsSchema;
