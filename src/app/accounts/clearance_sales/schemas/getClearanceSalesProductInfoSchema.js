const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getClearanceSalesProductInfoSchema = {
  tags: ["ClearanceSalesProduct"],
  summary: "This API is to get ClearanceSalesProduct",
  headers: { $ref: "request-headers#" },

  params: {
    type: "object",
    properties: {
      from_date: { type: "string" },
      to_date: { type: "string" },
      outlet_id: { type: "integer" }
    },
    required: ["from_date", "to_date", "outlet_id"]
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
              doc_no: { type: "integer" },
              doc_date: { type: "string", format: "date" },
              doc_time: { type: "string" },
              company_id: { type: "integer" },
              wh_id: { type: "integer" },
              outlet_id: { type: "integer" },
              outlet_name: { type: "string" },
              barcode: { type: "string" },
              prod_code: { type: "string" },
              prod_name: { type: "string" },
              mrp: { type: "string" },
              srate: { type: "string" },
              cqty: { type: "string" },
              uqty: { type: "string" }
            }
          }
        }
      }
    },

    ...errorSchemas
  }
};

module.exports = getClearanceSalesProductInfoSchema;
