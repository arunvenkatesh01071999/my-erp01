const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../../errorHandler");
const stockOutletSalesRepo = require("../repository/stockOutletSales");


function getStockLedgerOutletSalesService(fastify) {
    const { getStockOutletSalesLedger } = stockOutletSalesRepo(fastify);

    return async ({ body, params, query, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const response = await getStockOutletSalesLedger.call(knex, {
            body,
            params,
            logTrace
        });

        // Add the "balance" field to each item in the response
        response.forEach(item => {
            item.balance = item.pur_rate * (item.openqty + item.closing);
        });
        return response;
    };
}
function stockAllOutletLedgeOutletSalesService(fastify) {
    const { stockAllOutletLedgerOutletSales } = stockOutletSalesRepo(fastify);

    return async ({ body, params, query, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const response = await stockAllOutletLedgerOutletSales.call(knex, {
            body,
            params,
            logTrace
        });

        // Add the "balance" field to each item in the response
        response.forEach(item => {
            item.balance = item.pur_rate * (item.openqty + item.closing);
        });

        const transformedResponse = transformStockData(response);

        return transformedResponse;
        // return response;
    };
}

function transformStockData(response) {
    const transformedData = {};

    response.forEach(item => {
        const { category_name, subcategory_name, type_name, head_name, prodid, outlet_id, outlet_code, outlet_name, openqty, closing, pur_rate, pro_code, pro_name } = item;

        if (!transformedData[prodid]) {
            transformedData[prodid] = {
                category_name,
                subcategory_name,
                type_name,
                head_name,
                prodid,
                pro_code,
                pro_name,
                total_qty: 0,
                total_amount: 0,
                outlet_details: []
            };
        }

        const qty = parseFloat(openqty) + parseFloat(closing);
        const amount = parseFloat(pur_rate) * qty;

        transformedData[prodid].total_qty += qty;
        transformedData[prodid].total_amount += amount;

        const outletIndex = transformedData[prodid].outlet_details.findIndex(outlet => outlet.outlet_code === outlet_code);

        if (outletIndex === -1) {
            transformedData[prodid].outlet_details.push({
                outlet_id,
                outlet_code,
                outlet_name,
                qty,
                amount
            });
        } else {
            transformedData[prodid].outlet_details[outletIndex].qty += qty;
            transformedData[prodid].outlet_details[outletIndex].amount += amount;
        }
    });

    // Extract distinct outlets
    const distinctOutlets = Object.values(transformedData)
        .reduce((acc, category) => {
            category.outlet_details.forEach(outlet => {
                if (!acc[outlet.outlet_code]) {
                    acc[outlet.outlet_code] = {
                        outlet_code: outlet.outlet_code,
                        outlet_name: outlet.outlet_name
                    };
                }
            });
            return acc;
        }, {});

    // Prepare the output
    const output = Object.values(transformedData);

    return [{ outlets_names_header: Object.values(distinctOutlets) }, ...output];

    // return Object.values(transformedData);
}






module.exports = {
    getStockLedgerOutletSalesService,
    stockAllOutletLedgeOutletSalesService
};
