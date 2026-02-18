const { errorSchemas } = require("../../../commons/schemas/errorSchemas");


const putUnApprovedOutltetPoProductSchema = {
  tags: ["Outlet Purchase Order Update"],
  summary: "API to update unapproved outlet purchase orders",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      company_id: { type: "integer" },
      outlet_id: { type: "integer" }

    },
  },
  body: {
    type: "object",
    required: ["un_approved_pono"],
    properties: {
      un_approved_pono: {
        type: "array",
        description: "List of outlet purchase orders to update",
        items: {
          type: "object",
          required: ["pono", "approved"],
          properties: {
            pono: { type: "string", description: "Purchase order number" },
            approved: {
              type: "integer",
              enum: [1, 2, 3],
              description: "Approval status:1 - Approved,  2- Unapproved 3-grn complete"
            },
          },
        },
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean", description: "Indicates if the update was successful" },
      },
    },
    ...errorSchemas,
  },
};

module.exports = putUnApprovedOutltetPoProductSchema;
