const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postWalletTransferMstSchema = {
  tags: ["WalletTransferMaster"],
  summary: "This API is to post WalletTransferMaster",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["date", "outlet_id"],
    properties: {
      date: { type: "string", },
      transfer_from: { type: "string" },
      transfer_to: { type: "string" },
      outlet_id: { type: "integer" },
      transfer_amount: { type: "number" },
      description: { type: "string" }
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

module.exports = postWalletTransferMstSchema;
