const { format } = require("mysql");
const { errorSchemas } = require("../../commons/schemas/errorSchemas");
const { params } = require("./getOutletMemoSupplierListSchema");

const getOutletMemoPoNoListSchema = {
  tags: ["Supplier"],
  summary: "API to list suppliers with detailed information",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      outlet_id: { type: "integer" },
      supplier_id: { type: "integer" }
    },
    required: ["outlet_id", "supplier_id"]
  },

  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          po_no: { type: "string" },
          po_date: { type: "string", format: "date" },
          po_assigned: { type: "boolean" },
          po_assignee_name: { type: "string" },
          store_code: { type: "string" }
        }
      }
    },

    ...errorSchemas
  }
};

module.exports = getOutletMemoPoNoListSchema;
