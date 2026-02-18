const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const updatePackingPlanningSchema = {
  tags: ["Packing Planning"],
  summary: "Update planning header and detail records.",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    required: ["planning_id"],
    properties: {
      planning_id: { type: "integer", errorMessage: "id must be an integer" }
    }
  },
  body: {
    type: "object",
    required: [
      "pl_batchno",
      "pl_prodid",
      "pl_qty",
      "pl_grnno",
      "pl_grnqty",
      "pl_preqty",
      "pl_baldtl",
      "pl_totweight",
      "pl_packtype",
      "pl_packedqty",
      "planning_details"
    ],
    properties: {
      pl_batchno: { type: "string", errorMessage: "pl_batchno must be a string" },
      pl_prodid: { type: "integer", errorMessage: "pl_prodid must be an integer" },
      pl_qty: { type: "number", errorMessage: "pl_qty must be a number" },
      pl_grnno: { type: "string", errorMessage: "pl_grnno must be a string" },
      pl_grnqty: { type: "number", errorMessage: "pl_grnqty must be a number" },
      pl_preqty: { type: "number", errorMessage: "pl_preqty must be a number" },
      pl_baldtl: { type: "number", errorMessage: "pl_baldtl must be a number" },
      pl_totweight: { type: "number", errorMessage: "pl_totweight must be a number" },
      pl_packtype: { type: "string", errorMessage: "pl_packtype must be a string" },
      pl_packedqty: { type: "number", errorMessage: "pl_packedqty must be a number" },
      planning_details: {
        type: "array",
        minItems: 1,
        errorMessage: "planning_details must be a non-empty array",
        items: {
          type: "object",
          required: ["pl_prodid", "pl_qty", "pd_weight"],
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

module.exports = updatePackingPlanningSchema;
