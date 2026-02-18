const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getOutletClosingStocksTempSchema = {
    description: "Get outlet closing stocks temporary list",
    tags: ["Outlet", "Stock"],
    summary: "Outlet closing stocks temp list",
    params: {
        type: "object",
        required: ["outlet_id"],
        properties: {
            outlet_id: { type: "integer" }
        }
    },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    docdate: { type: "string", format: "date" },
                    prodid: { type: "integer" },
                    physical_qty: { type: "number" },
                    computer_qty: { type: "number" },
                    purchase_rate: { type: "number" },
                    sales_rate: { type: "number" },
                    mrp: { type: "number" },
                    outlet_id: { type: "integer" },
                    pro_code: { type: "string" },
                    pro_name: { type: "string" },
                    balance_stock: { type: "number" },
                    units_short_name: { type: "string" }
                }
            }
        },
        ...errorSchemas
    }
};

module.exports = getOutletClosingStocksTempSchema;
