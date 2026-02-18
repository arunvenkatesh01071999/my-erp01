const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getRedetailsSchema = {
    tags: ["GET RATE ENTRY DETAILS"],
    summary: "API to list Rate entry details",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        required: ["tr_id", "loc_id", "tr_date"],
        properties: {
            tr_id: { type: "integer" },
            loc_id: { type: "integer" },
            tr_date: { type: "string", format: "date" }
        },
    },


    response: {
        200: {
            type: "object",
            properties: {
                status: { type: "string", enum: ["1", "0"] }, // Always "1" in response
                message: {
                    oneOf: [
                        {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    trid: { type: "integer" },
                                    prodid: { type: "integer" },
                                    rate: { type: "string" },
                                    onlinerate: { type: "string" },
                                    tr_date: {
                                        type: "string",
                                        format: "date",
                                        description: "Transaction date in YYYY-MM-DD format"
                                    },
                                    tr_time: {
                                        type: "string",
                                        description: "Transaction timestamp in YYYY-MM-DD HH:MM:SS format"
                                    }
                                }
                            },
                        },
                        {
                            type: "string"
                        }
                    ]

                }
            },
            required: ["status", "message"]
        },
        ...errorSchemas
    }

};

module.exports = getRedetailsSchema;
