const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSupplierPaginateSchema = {
  tags: ["SUPPLIER"],
  summary: "This API is to get SUPPLIER",
  headers: { $ref: "request-headers#" },
  queryString: {
    type: "object",
    required: ["status", "search"],
    additionalProperties: false,
    properties: {
      status: { type: "integer", enum: [0, 1, 2], default: 0 },
      search: { type: "string", default: "" }
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
              supplier_name: { type: "string" },
              short_name: { type: "string" },
              add1: { type: "string" },
              add2: { type: "string" },
              add3: { type: "string" },
              add4: { type: "string" },
              city: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  name: { type: "string" }
                }
              },
              state: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  name: { type: "string" }
                }
              },
              country: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  name: { type: "string" }
                }
              },
              pincode: { type: "string" },
              phone: { type: "string" },
              mobile: { type: "string" },
              email: { type: "string" },
              website: { type: "string" },
              gstin: { type: "string" },
              op_bal: { type: "string" },
              balance: { type: "string" },
              custtype: { type: "string" },
              bankacno: { type: "string" },
              bankname: { type: "string" },
              acname: { type: "string" },
              ifsccode: { type: "string" },
              company_id: { type: "integer" },
              is_active: { type: "boolean" },
              fssai: { type: "string" }
            }
          }
        },
        meta: { $ref: "response-meta#" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getSupplierPaginateSchema;
