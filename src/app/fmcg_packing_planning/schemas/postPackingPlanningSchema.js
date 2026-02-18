const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postPlanningSchema = {
  tags: ["Packing Planning"],
  summary: "Insert planning header and detail records.",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: [
      "pl_date",
      "pl_packtype",
      "pl_batchno",
      "pl_prodid",
      "pl_qty",
      "pl_totweight",
      "pl_indentno",
      "planning_details"
    ],
    properties: {
      pl_date: { type: "string", errorMessage: "pl_batchno must be a string" },
      pl_packtype: { type: "integer", errorMessage: "pl_packtype must be a integer" },
      pl_batchno: { type: "string", errorMessage: "pl_batchno must be a string" },
      pl_prodid: { type: "integer", errorMessage: "pl_prodid must be an integer" },
      pl_qty: { type: "number", errorMessage: "pl_qty must be a number" },
      pl_totweight: { type: "number", errorMessage: "pl_totweight must be a number" },
      pl_indentno: { type: "string", errorMessage: "pl_indentno must be a string" },
      planning_details: {
        type: "array",
        minItems: 1,
        errorMessage: "planning_details must be a non-empty array",
        items: {
          type: "object",
          required: ["pl_prodid", "pl_qty", "pd_weight"],
          properties: {
            pl_prodid: { type: "integer", errorMessage: "pl_prodid must be an integer" },
            pl_qty: { type: "number", errorMessage: "pl_qty must be a number" },
            pd_weight: { type: "number", errorMessage: "pd_weight must be a number" }
          }
        }
      }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" }
      }
    },
    ...errorSchemas
  }
};


module.exports = postPlanningSchema;
