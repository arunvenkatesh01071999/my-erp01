const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postPurchaseFVGrnProductSchema = {
  tags: ["PURCHASE FV GRN PRODUCT SCHEMA"],
  summary: "This API is to post a purchase GRN product schema",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: [
      "docdate",
      "supplier_id",
      "total_qty",
      "total_amt",
      "total_gst",
      "purchase_grn_details"
    ],
    properties: {
      docdate: {
        type: "string",
        format: "date",
        errorMessage: "docdate must be a valid date in YYYY-MM-DD format"
      },
      supplier_id: {
        type: "integer",
        errorMessage: "supplier_id must be an integer"
      },
      wh_id: {
        type: "integer",
        errorMessage: "wh_id must be an integer"
      },
      company_id: {
        type: "integer",
        errorMessage: "company_id must be an integer"
      },
      total_qty: {
        type: "integer",
        errorMessage: "total_qty must be an integer"
      },
      total_amt: {
        type: "number",
        errorMessage: "total_amt must be a number"
      },
      total_gst: {
        type: "number",
        errorMessage: "total_gst must be a number"
      },
      total_cess: {
        type: "number",
        errorMessage: "total_cess must be a number"
      },
      roff: {
        type: "number",
        errorMessage: "roff must be a number"
      },
      freight_charges: {
        type: "number",
        errorMessage: "freight_charges must be a number"
      },
      other_charges: {
        type: "number",
        errorMessage: "other_charges must be a number"
      },
      expiry_date: {
        type: "string",
        format: "date",
        errorMessage: "expiry_date must be a valid date in YYYY-MM-DD format"
      },
      is_active: {
        type: "boolean",
        errorMessage: "is_active must be a boolean"
      },
      purchase_grn_details: {
        type: "array",
        items: {
          type: "object",
          required: [
            "product_id",
            "qty",
            "category_id",
            "sub_category_id",
            "head_id",
            "type_design_id",
            "uom_id",
            "barcode",
            "mrp",
            "gst_per",
            "pur_rate",
            "igst"
          ],
          properties: {
            product_id: {
              type: "integer",
              errorMessage: "product_id must be an integer"
            },
            prod_code: {
              type: "string",
              errorMessage: "prod_code must be a string"
            },
            qty: {
              type: "integer",
              errorMessage: "qty must be an integer"
            },
            received_qty: {
              type: "integer",
              errorMessage: "received_qty must be an integer"
            },
            category_id: {
              type: "integer",
              errorMessage: "category_id must be an integer"
            },
            sub_category_id: {
              type: "integer",
              errorMessage: "sub_category_id must be an integer"
            },
            head_id: {
              type: "integer",
              errorMessage: "head_id must be an integer"
            },
            type_design_id: {
              type: "integer",
              errorMessage: "type_design_id must be an integer"
            },
            uom_id: {
              type: "integer",
              errorMessage: "uom_id must be an integer"
            },
            barcode: {
              type: "string",
              errorMessage: "barcode must be a string"
            },
            mrp: {
              type: "number",
              errorMessage: "mrp must be a number"
            },
            gst_per: {
              type: "number",
              errorMessage: "gst_per must be a number"
            },
            cess_per: {
              type: "number",
              errorMessage: "cess_per must be a number"
            },
            pur_rate: {
              type: "number",
              errorMessage: "pur_rate must be a number"
            },
            company_id: {
              type: "integer",
              errorMessage: "company_id must be an integer"
            },
            igst: {
              type: "number",
              errorMessage: "igst must be a number"
            }
          }
        }
      },
      tray_details: {
        type: "array",
        items: {
          type: "object",
          required: ["tray_id", "tray_qty"],
          properties: {
            tray_id: {
              type: "integer",
              errorMessage: "tray_id must be an integer"
            },
            tray_qty: {
              type: "integer",
              errorMessage: "tray_qty must be an integer"
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
        docno: { type: "string" }
      }
    },
    ...errorSchemas
  }
};

module.exports = postPurchaseFVGrnProductSchema;
