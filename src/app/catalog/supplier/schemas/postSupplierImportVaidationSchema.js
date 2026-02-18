const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const fieldSchema = {
  type: "object",
  properties: {
    value: { type: "string" },
    error: { type: "boolean" },
    errorvalue: { type: "string" },
  },
  required: ["value", "error","errorvalue"]
};

const postSupplierImportVaidationSchema = {
  tags: ["Supplier"],
  summary: "Supplier Import Validation API",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          supplier_name: fieldSchema,
          add1: fieldSchema,
          add2: fieldSchema,
          pincode: fieldSchema,
          city_name: fieldSchema,
          state_name: fieldSchema,
          country_name: fieldSchema,
          mobile: fieldSchema,
          alter_mobile_no: fieldSchema,
          email: fieldSchema,
          alter_email: fieldSchema,
          gstin: fieldSchema,
          pan_number: fieldSchema,
          msme_applicable: fieldSchema,
          msme_declaration: fieldSchema,
          msme_number: fieldSchema,
          credit_days: fieldSchema,
          ac_name: fieldSchema,
          bankname: fieldSchema,
          bank_ac_no: fieldSchema,
          ifsccode: fieldSchema,
          payment_terms: fieldSchema,
          fssai_expiry: fieldSchema,
          pan_status: fieldSchema,
          gst_status: fieldSchema,
          product_type: fieldSchema,
          gst_type: fieldSchema,
          short_name: fieldSchema,
          purchase: fieldSchema,
          transfer: fieldSchema,
          fssaino: fieldSchema,
          month_days: fieldSchema,
          designation: fieldSchema,
          contact_person: fieldSchema,
          region_id: fieldSchema,
          warehouse_type: fieldSchema
        },
        required: [
          "supplier_name",
          "add1",
          "add2",
          "pincode",
          "city_name",
          "state_name",
          "country_name",
          "mobile",
          "alter_mobile_no",
          "email",
          "alter_email",
          "gstin",
          "pan_number",
          "msme_applicable",
          "msme_declaration",
          "msme_number",
          "credit_days",
          "ac_name",
          "bankname",
          "bank_ac_no",
          "ifsccode",
          "payment_terms",
          "fssai_expiry",
          "pan_status",
          "gst_status",
          "product_type",
          "gst_type",
          "short_name",
          "purchase",
          "transfer",
          "fssaino",
          "month_days",
          "designation",
          "contact_person",
          "region_id",
          "warehouse_type"
        ]
      }
    },
    ...errorSchemas
  }
};

module.exports = postSupplierImportVaidationSchema;
