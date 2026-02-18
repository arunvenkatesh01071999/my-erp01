const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getPackingPlanningByIdSchema = {
  tags: ["FNV PackingPlanning"],
  summary: "Get Packing Planning by ID with details",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      id: { type: "integer" }
    },
    required: ["id"]
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            id: { type: "integer" },
            parent_product_name: { type: "string" },
            pl_year: { type: "string" },
            pl_comid: { type: "string" },
            pl_date: { type: "string", format: "date" },
            pl_uid: { type: "string" },
            pl_batchno: { type: "string" },
            pl_prodid: { type: "string" },
            pl_qty: { type: "number" },
            pl_grnno: { type: "string" },
            pl_flag: { type: "string" },
            pl_grnqty: { type: "number" },
            pl_preqty: { type: "number" },
            pl_baldtl: { type: "string" },
            pl_totweight: { type: "number" },
            pl_packtype: { type: "string" },
            pl_packedqty: { type: "number" },
            details: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  uom_name: { type: "string" },
                  pro_name: { type: "integer" },
                  pl_hdr_id: { type: "integer" },
                  pd_year: { type: "string" },
                  pd_comid: { type: "string" },
                  pd_slno: { type: "integer" },
                  pl_prodid: { type: "string" },
                  pl_qty: { type: "number" },
                  pd_weight: { type: "number" },

                }
              }
            }
          }
        },
        meta: { $ref: "response-meta#" }
      },
      additionalProperties: true
    },
    ...errorSchemas
  }
};

module.exports = getPackingPlanningByIdSchema;
