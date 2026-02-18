const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postWarehouseCleaningStockSchema = {
  tags: ["Warehouse"],
  summary: "Create warehouse cleaning stock",
  description: "Save warehouse cleaning stock master and details in single transaction",

  body: {
    type: "object",
    required: ["warehouse_id", "total_cleaned_stock", "warehouse_cleaning_stock_details"],
    properties: {
      warehouse_id: {
        type: "integer",
        minimum: 1
      },
      total_cleaned_stock: {
        type: "number",
        minimum: 0
      },
      warehouse_cleaning_stock_details: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          required: [
            "product_id",
            "product_code",
            "total_stock",
            "picked_cleaning_stock",
            "wastage_stock",
            "cleaning_stock"
          ],
          properties: {
            product_id: {
              type: "integer",
              minimum: 1
            },
            product_code: {
              type: "string",
              minLength: 1
            },
            total_stock: {
              type: "number",
              minimum: 0
            },
            picked_cleaning_stock: {
              type: "number",
              minimum: 0
            },
            wastage_stock: {
              type: "number",
              minimum: 0
            },
            cleaning_stock: {
              type: "number",
              minimum: 0
            }
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
        message: { type: "string" },
        docNo: { type: "integer" },
        memoMasterId: { type: "integer" }
      }
    },
    ...errorSchemas
  }
};

module.exports = { postWarehouseCleaningStockSchema };
