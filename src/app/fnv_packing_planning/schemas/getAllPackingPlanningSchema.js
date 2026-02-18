const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getAllPackingPlanningSchema = {
  tags: ["FNV PackingPlanning"],
  summary: "Get all Packing Planning headers",
  headers: { $ref: "request-headers#" },

  queryString: {
    type: "object",
    additionalProperties: false,
    properties: {
      search: { type: "string", default: "" },
      from_date: { type: "string", format: "date-time" },
      to_date: { type: "string", format: "date-time" },
    },
  },

  params: {
    type: "object",
    properties: {
      page_size: { type: "integer" },
      current_page: { type: "integer" }
    }
  },

  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              pro_name: { type: "string" },
              pl_year: { type: "string" },
              docno: { type: "integer" },
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
              pl_packedqty: { type: "string" }
            }
          }
        },
        meta: { $ref: "response-meta#" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getAllPackingPlanningSchema;
