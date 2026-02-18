const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const fieldSchema = {
  type: "object",
  properties: {
    value: { type: "string" },   // always string, since we normalize to string
    error: { type: "boolean" }
  },
  required: ["value", "error"]
};

const postItemImportVaidationSchema = {
  tags: ["Item"],
  summary: "This API is to post Item",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          Product_Code: fieldSchema,
          Product_Name: fieldSchema,
          MRP: fieldSchema,
          GST: fieldSchema,
          CESS: fieldSchema,
          Main_Category: fieldSchema,
          Sub_Category: fieldSchema,
          Merchandise: fieldSchema,
          Brand: fieldSchema,
          BrandCompany: fieldSchema,
          Unit: fieldSchema,
          HSN: fieldSchema,
          Batch: fieldSchema,
          Barcode: fieldSchema,
          Barcode1: fieldSchema,
          Barcode2: fieldSchema,
          Barcode3: fieldSchema,
          Barcode4: fieldSchema
        },
        required: [
          "Product_Code",
          "Product_Name",
          "MRP",
          "GST",
          "CESS",
          "Main_Category",
          "Sub_Category",
          "Merchandise",
          "Brand",
          "BrandCompany",
          "Unit",
          "HSN",
          "Batch",
          "Barcode1",
          "Barcode2",
          "Barcode3",
          "Barcode4"
        ]
      }
    },
    ...errorSchemas
  }
};

module.exports = postItemImportVaidationSchema;
