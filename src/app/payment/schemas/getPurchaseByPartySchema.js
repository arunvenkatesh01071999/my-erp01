const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getPurchaseByPartySchema = {
    tags: ["Purchases against party "],
    summary: "This API is to get Purchases against party ",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            partyid: { type: "integer" }
        }
    },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    docno: { type: "string" },
                    docdate: { type: "string", format: "date" },
                    partycode: { type: "integer" },
                    amount: { type: "number" },
                    subtotal_amount: { type: "number" },
                    gst_per: { type: "number" },
                    gst_amt: { type: "number" },
                    cess_per: { type: "number" },
                    cess_amt: { type: "number" },
                    roff: { type: "number" },
                    paid: { type: "number" },
                    outstanding: { type: "number" }
                }
            }
        },
        ...errorSchemas
    }
};

module.exports = getPurchaseByPartySchema;
