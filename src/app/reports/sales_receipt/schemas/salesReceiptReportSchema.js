const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const salesReceiptReportSchema = {
  tags: ["Sales Receipt Report"],
  summary: "This API is to get sales report",
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
        properties: {
          id: { type: "integer" },
          date: { type: "string", format: "date-time" },
          supplierid: { type: "integer" },
          mode: { type: "integer" },
          amount: { type: "string" },
          chequeno: { type: "string" },
          chequedate: { type: "string" },
          bank: { type: "string" },
          discount: { type: "string" },
          refno: { type: "string" },
          company_id: { type: "integer" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
          created_by: { type: ["integer", "null"] },
          updated_by: { type: ["integer", "null"] },
          name: { type: ["string", "null"] },
          short_name: { type: ["string", "null"] },
          add1: { type: ["string", "null"] },
          add2: { type: ["string", "null"] },
          add4: { type: ["string", "null"] },
          city: { type: ["integer", "null"] },
          pincode: { type: ["string", "null"] },
          state: { type: ["integer", "null"] },
          country: { type: ["integer", "null"] },
          phone: { type: ["string", "null"] },
          mobile: { type: ["string", "null"] },
          email: { type: ["string", "null"], format: "email" },
          website: { type: ["string", "null"], format: "uri" },
          gstin: { type: ["string", "null"] },
          fssaino: { type: ["string", "null"] },
          bank_ac_no: { type: ["string", "null"] },
          bankname: { type: ["string", "null"] },
          ac_name: { type: ["string", "null"] },
          ifsccode: { type: ["string", "null"] },
          state_name: { type: ["string", "null"] },
          city_name: { type: ["string", "null"] },
          country_name: { type: ["string", "null"] }

        }
      }
    },
    ...errorSchemas
  }
};

module.exports = salesReceiptReportSchema;
