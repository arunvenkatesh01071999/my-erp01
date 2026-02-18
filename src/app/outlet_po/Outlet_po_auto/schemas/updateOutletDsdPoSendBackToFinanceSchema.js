const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const updateOutletDsdPoSendBackToFinanceSchema = {
  tags: ["OUTLET PURCHASE MEMO"],
  summary: "Clear invoice PDF and update remark for outlet purchase memo",
  headers: { $ref: "request-headers#" },

  body: {
    type: "object",
    required: ["outlet_id", "supplier_id", "po_no", "po_finance_remarks"],
    properties: {
      outlet_id: { type: "integer" },
      supplier_id: { type: "integer" },
      po_no: { type: "string" },
      po_finance_remarks: { type: "string" }
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

module.exports = updateOutletDsdPoSendBackToFinanceSchema;
