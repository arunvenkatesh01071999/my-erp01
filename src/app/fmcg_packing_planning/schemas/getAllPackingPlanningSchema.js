const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getPackingPlanningByIdSchema = {
  tags: ["FNV PackingPlanning"],
  summary: "Get Packing Planning by ID",
  headers: { $ref: "request-headers#" },

  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          docno: { type: "integer" },
          grn_id: { type: "integer" },
          pro_name: { type: "string" },
          pl_year: { type: "integer" },
          pl_comid: { type: "integer" },
          pl_date: { type: "string", format: "date-time" },
          pl_batchno: { type: "string" },
          pl_prodid: { type: "integer" },
          pl_qty: { type: "string" },
          pl_grnno: { type: "string" },
          is_active: { type: "boolean" },
          pl_grnqty: { type: "string" },
          pl_preqty: { type: "string" },
          pl_baldtl: { type: "string" },
          pl_totweight: { type: "string" },
          pl_packtype: { type: "string" },
          pl_packedqty: { type: "string" },
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getPackingPlanningByIdSchema;
