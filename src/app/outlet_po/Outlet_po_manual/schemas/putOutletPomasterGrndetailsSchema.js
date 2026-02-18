const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putOutletPomasterGrndetailsSchema = {
  tags: ["Outlet Purchase Order GRN Update"],
  summary:
    "API to update outlet purchase orders GRN details (GRN number, GRN date, Invoice Number, GRN quantity, Invoice copy Url, Payment Status)",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      po_no: { type: "string" },
      outlet_id: { type: "integer" },
    },
    required: ["po_no", "outlet_id"],
  },
  body: {
    type: "object",
    required: ["grn_details"],
    properties: {
      grn_details: {
        type: "array",
        description: "List of purchase order GRN details to update",
        items: {
          type: "object",
          properties: {
            grn_number: {
              type: "string",
              minLength: 1,
              description: "GRN Number of the PO",
            },
            grn_date: {
              type: "string",
              format: "date",
              description: "GRN Date of the PO",
            },
            invoice_number: {
              type: "string",
              minLength: 1,
              description: "Invoice number",
            },
            grn_quantity: {
              type: "number",
              description: "GRN quantity to update",
            },
            invoice_copy_url: {
              type: "string",
              minLength: 1,
              description: "Invoice copy URL",
            },
            payment_status: {
              type: "integer",
              enum: [0, 1],
              description: "Payment Status (0 = Pending, 1 = Paid)",
            }
          },

          anyOf: [
            {
              required: ["grn_number"],
              properties: { grn_number: { type: "string" } }
            },
            {
              required: ["grn_date"],
              properties: { grn_date: { type: "string" } }
            },
            {
              required: ["invoice_number"],
              properties: { invoice_number: { type: "string" } }
            },
            {
              required: ["grn_quantity"],
              properties: { grn_quantity: { type: "number" } }
            },
            {
              required: ["invoice_copy_url"],
              properties: { invoice_copy_url: { type: "string" } }
            },
            {
              required: ["payment_status"],
              properties: { payment_status: { type: "integer" } }
            }
          ],

          errorMessage: {
            anyOf:
              "At least one of grn_number, grn_date, invoice_number, grn_quantity, invoice_copy_url, or payment_status must be provided."
          },

          additionalProperties: false,
        },
        minItems: 1,
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
      },
    },
    ...errorSchemas,
  },
};

module.exports = putOutletPomasterGrndetailsSchema;
