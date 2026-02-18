const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getPackingPlanningByIdSchema = {
  tags: ["FNV PackingPlanning"],
  summary: "Get Packing Planning by ID",
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
        id: { type: "integer" },
        grn_id: { type: "integer" },
        docno: { type: "integer" },
        parent_product_name: { type: "string" },
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
        manufacture_date: { type: "string", format: "date" },
        details: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              pl_hdr_id: { type: "integer" },
              pd_year: { type: "integer" },
              pd_comid: { type: "integer" },
              pl_prodid: { type: "integer" },
              pl_qty: { type: "string" },
              pd_weight: { type: "string" },
              product_name: { type: "string" },
              pro_code: { type: "string" },
              pro_description: { type: "string" },
              parent_product_id: { type: "integer" },
              product_weight: { type: "number" },
              units_short_name: { type: "string" },
              expiry_date: { type: "string", format: "date" }
            }
          }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getPackingPlanningByIdSchema;
