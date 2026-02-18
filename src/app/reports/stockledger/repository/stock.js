const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { SALESMASTER, SALESDETAILS } = require("../../../sales/commons");
const {
    MAIN_CATEGORY
} = require("../../../catalog/category/commons/constants");
const { SUB_CATEGORY } = require("../../../catalog/category/commons/constants");
const { UNITS } = require("../../../catalog/units/commons/constants");
const { OUTLETS } = require("../../../accounts/outlets/commons/constants");
const { OUTLETTYPE } = require("../../../accounts/outlets/commons/constants");
const { STATES } = require("../../../masterData/commons/constants");
const { CITIES } = require("../../../masterData/commons/constants");
const { COUNTRIES } = require("../../../masterData/commons/constants");
const { ITEM } = require("../../../catalog/commons");
const { HEADS } = require("../../../catalog/commons");
const { TYPEDESIGN } = require("../../../catalog/commons");

function stockRepo(fastify) {

    async function getStockLedger({ params, body, logTrace }) {
        const knex = this;

        const query = knex('stockledger as a')
            .select(
                'pro_code',
                'pro_name',
                'prod_id',
                'units_short_name',
                'pur_rate',
                knex.raw('sum(purchase_qty) as purchase'),
                knex.raw('sum(sale_qty) as sales'),
                knex.raw('sum(purchase_return_qty) as purchasereturn'),
                knex.raw('sum(wastage_qty) as waste'),
                knex.raw('sum(adjust_qty) as adjust'),
                knex.raw('sum(free_qty) as free'),
                knex.raw('sum(sales_in_qty) as inQty'),
                knex.raw('sum(sales_return_qty) as salesreturn'),
                knex.raw('sum(tr_in_qty) as tr_in_qty'),
                knex.raw('sum(tr_out_qty) as tr_out_qty'),
                knex.raw('(select COALESCE(sum(purchase_qty - sale_qty - purchase_return_qty - wastage_qty - tr_out_qty + tr_in_qty + adjust_qty + free_qty + sales_in_qty + sales_return_qty), 0) from stockledger as b where b.prod_id = a.prod_id and date(b.date) < ?) as openQty', body.from_date),
                knex.raw('sum(purchase_qty - sale_qty - purchase_return_qty - wastage_qty + adjust_qty + free_qty + sales_in_qty + sales_return_qty) as closing')
            )
            .leftJoin('item as c', 'c.id', 'a.prod_id')
            .leftJoin('units as d', 'd.id', 'c.uom')
            .whereRaw('date(a.date) >= ?', body.from_date)
            .whereRaw('date(a.date) <= ?', body.to_date)
            .groupBy('pro_code', 'pro_name', 'prod_id', 'units_short_name', 'pur_rate');

        if (body.category && body.category !== 0) {
            query.whereRaw('c.cat_id >= ?', body.category);
        }
        logQuery({
            logger: fastify.log,
            query,
            context: "Get Stock ledger",
            logTrace
        });
        const response = await query;
        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Stock ledger  not found",
                property: "",
                code: "NOT_FOUND"
            });
        }
        return response;
    }

    return {

        getStockLedger

    };
}

module.exports = stockRepo;
