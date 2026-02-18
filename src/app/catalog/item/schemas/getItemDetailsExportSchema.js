const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getItemDetailsExportSchema = {
  tags: ["GET ITEMS Details Schema"],
  summary: "This API is to get Items list",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      company_id: { type: "integer" }
    },
    required: ["company_id"]
  },
  query: {
    type: "object",
    properties: {
      type_id: {
        type: ["integer", "null"], // allows null
        nullable: true             // allows missing or null
      }
    }
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          Product_Code: { type: "string" },
          Product_Name: { type: "string" },
          MRP: { type: "number" },
          GST: { type: "integer" },
          CESS: { type: "integer" },
          Main_Category: { type: "string" },
          Sub_Category: { type: "string" },
          Merchandise: { type: "string" },
          Brand: { type: "string" },
          BrandCompany: { type: "string" },
          Unit: { type: "string" },
          HSN: { type: "string" },
          Batch: { type: "string" },
          Barcode: { type: "string" },
          Barcode1: { type: "string" },
          Barcode2: { type: "string" },
          Barcode3: { type: "string" },
          Barcode4: { type: "string" },
          Expiry_Type: {
            type: "string", // allows null
            nullable: true             // allows missing or null
          },
          Expiry_Value: {
            type: "integer", // allows null
            nullable: true             // allows missing or null
          }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getItemDetailsExportSchema;
