const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postWastageListSchema = {
    tags: ["Wastage calculation List"],
    summary: "API for Wastage calculation List.",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["item_id", "tray_id", "tray_count", "weight", "reason"],
        properties: {
            item_id: { type: "integer" },
            tray_id: { type: "integer" },
            tray_count: { type: "number" },
            weight: { type: "number" },
            reason: { type: "string" }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                item_id: { type: "integer" },
                tray_id: { type: "integer" },
                item_name: { type: "string" },
                item_rate: { type: "number" },
                item_gst: { type: "number" },
                item_cess: { type: "number" },
                tray_name: { type: "string" },
                reason: { type: "string" },
                uom_name: { type: "string" },
                tray_count: { type: "number" },
                tray_weight: { type: "number" },
                tray_total_weight: { type: "number" },
                net_weight: { type: "number" }
            }
        },
        ...errorSchemas
    }
};

module.exports = postWastageListSchema;
