const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getCitiesByPincodeSchema = {
  tags: ["Fetch Cities By Pincode"],
  summary: "This API is used to fetch country, state, and city details by pincode",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    required: ["pincode"],
    properties: {
      pincode: { type: "string" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        country: {
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
        city: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" }
          }
        }
      },
      required: ["country", "state", "city"]
    },
    ...errorSchemas
  }
};

module.exports = getCitiesByPincodeSchema;
