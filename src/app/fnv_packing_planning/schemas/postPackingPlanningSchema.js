const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postPlanningSchema = {
  tags: ["Packing Planning"],
  summary: "Insert planning header and detail records.",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: [
      "pl_date",
      "pl_batchno",
      "pl_prodid",
      "pl_qty",
      "pl_grnno",
      "pl_flag",
      "pl_grnqty",
      "pl_preqty",
      "pl_baldtl",
      "pl_totweight",
      "pl_packtype",
      "pl_packedqty",
      "planning_details"
    ],
    properties: {
      pl_date: {
        type: "string",
        format: "date-time",
        errorMessage: "pl_date must be a valid date-time format"
      },
      pl_batchno: { type: "string", errorMessage: "pl_batchno must be a string" },
      pl_prodid: { type: "integer", errorMessage: "pl_prodid must be an integer" },
      pl_qty: { type: "number", errorMessage: "pl_qty must be a number" },
      pl_grnno: { type: "string", errorMessage: "pl_grnno must be a string" },
      pl_flag: { type: "integer", errorMessage: "pl_flag must be an integer" }, // changed from string
      pl_grnqty: { type: "number", errorMessage: "pl_grnqty must be a number" },
      pl_preqty: { type: "number", errorMessage: "pl_preqty must be a number" },
      pl_baldtl: { type: "string", errorMessage: "pl_baldtl must be a string" },
      pl_totweight: { type: "number", errorMessage: "pl_totweight must be a number" },
      pl_packtype: { type: "string", errorMessage: "pl_packtype must be a string" },
      pl_packedqty: { type: "number", errorMessage: "pl_packedqty must be a number" },
      planning_details: {
        type: "array",
        minItems: 1,
        errorMessage: "planning_details must be a non-empty array",
        items: {
          type: "object",
          required: ["pd_slno", "pl_prodid", "pl_qty", "pd_weight"],
          properties: {
            pd_slno: { type: "integer", errorMessage: "pd_slno must be an integer" },
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
