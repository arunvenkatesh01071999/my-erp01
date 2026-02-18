const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../../errorHandler");
const { logQuery } = require("../../../../commons/helpers");
const { OUTLETSALESMASTER, OUTLETSALESDETAILS } = require("../../../../outlet_sales/outlet_sales_master/commons/constants");
// const { SALESMASTER, SALESDETAILS } = require("../../../sales/commons");
const {
    MAIN_CATEGORY
} = require("../../../../catalog/category/commons/constants");
const { SUB_CATEGORY } = require("../../../../catalog/category/commons/constants");
const { UNITS } = require("../../../../catalog/units/commons/constants");
const { OUTLETS, OUTLETTYPE } = require("../../../../accounts/outlets/commons/constants");
const { STATES } = require("../../../../masterData/commons/constants");
const { CITIES } = require("../../../../masterData/commons/constants");
const { COUNTRIES } = require("../../../../masterData/commons/constants");
const { ITEM } = require("../../../../catalog/commons");
const { HEADS } = require("../../../../catalog/commons");
const { TYPEDESIGN } = require("../../../../catalog/commons");

function stockOutletSalesRepo(fastify) {

    async function getStockOutletSalesLedger({ params, body, logTrace }) {
        const knex = this;

        const query = knex('outlet_stock_ledger as a')
            .select(
                'pro_code',
                'pro_name',
                'prodid',
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
                knex.raw('(select COALESCE(sum(purchase_qty - sale_qty - purchase_return_qty - wastage_qty - tr_out_qty + tr_in_qty + adjust_qty + free_qty + sales_in_qty + sales_return_qty), 0) from outlet_stock_ledger as b where b.prodid = a.prodid and date(b.date) < ?) as openQty', body.from_date),
                knex.raw('sum(purchase_qty - sale_qty - purchase_return_qty - wastage_qty + adjust_qty + free_qty + sales_in_qty + sales_return_qty) as closing')
            )
            .leftJoin('item as c', 'c.id', 'a.prodid')
            .leftJoin('units as d', 'd.id', 'c.uom')
            .whereRaw('date(a.date) >= ?', body.from_date)
            .whereRaw('date(a.date) <= ?', body.to_date)
            .groupBy('pro_code', 'pro_name', 'prodid', 'units_short_name', 'pur_rate');

        if (body.category && body.category !== 0) {
            query.whereRaw('c.cat_id >= ?', body.category);
        }
        logQuery({
            logger: fastify.log,
            query,
            context: "Get outlet sales Stock ledger",
            logTrace
        });
        const response = await query;
        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "outlet sales Stock ledger  not found",
                property: "",
                code: "NOT_FOUND"
            });
        }
        return response;
    }
    async function stockAllOutletLedgerOutletSales({ params, body, logTrace }) {
        const knex = this;

        const query = knex('outlet_stock_ledger as a')
            .select(
                'e.id as outlet_id',
                'e.code as outlet_code',
                'e.short_name as outlet_short_name',
                'e.fullname as outlet_name',
                'f.category_name',
                'g.subcategory_name',
                'h.type_name',
                'i.cateogory_name as head_name',
                'pro_code',
                'pro_name',
                'prodid',
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
                knex.raw('(select COALESCE(sum(purchase_qty - sale_qty - purchase_return_qty - wastage_qty - tr_out_qty + tr_in_qty + adjust_qty + free_qty + sales_in_qty + sales_return_qty), 0) from outlet_stock_ledger as b where b.prodid = a.prodid and date(b.date) < ?) as openQty', body.from_date),
                knex.raw('sum(purchase_qty - sale_qty - purchase_return_qty - wastage_qty + adjust_qty + free_qty + sales_in_qty + sales_return_qty) as closing')
            )
            .leftJoin('item as c', 'c.id', 'a.prodid')
            .leftJoin('units as d', 'd.id', 'c.uom')
            .leftJoin('outlets as e', 'e.id', 'a.outletid')
            .leftJoin('main_category as f', 'f.id', 'c.cat_id')
            .leftJoin('sub_category as g', 'g.id', 'c.sub_cat')
            .leftJoin('typedesign as h', 'h.id', 'c.type')
            .leftJoin('heads as i', 'i.id', 'c.head_id')
            .whereRaw('date(a.date) >= ?', body.from_date)
            .whereRaw('date(a.date) <= ?', body.to_date)
            .groupBy('pro_code', 'pro_name', 'prodid', 'units_short_name', 'pur_rate', 'e.id', 'e.code', 'e.short_name', 'e.fullname', 'f.category_name', 'g.subcategory_name', 'h.type_name', 'i.cateogory_name');


        // Conditionally add filters based on provided parameters
        if (body.customer && body.customer !== 0) {
            query.whereRaw('a.outletid >= ?', body.customer);
        }
        if (body.category && body.category !== 0) {
            query.whereRaw('c.cat_id >= ?', body.category);
        }
        if (body.subcategory && body.subcategory !== 0) {
            query.whereRaw('c.sub_cat >= ?', body.subcategory);
        }
        if (body.type && body.type !== 0) {
            query.whereRaw('c.type >= ?', body.type);
        }
        if (body.head && body.head !== 0) {
            query.whereRaw('c.head_id >= ?', body.type);
        }
        logQuery({
            logger: fastify.log,
            query,
            context: "Get all outlet sales Stock ledger",
            logTrace
        });
        const response = await query;
        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "No Data Found",
                property: "",
                code: "NOT_FOUND"
            });
        }
        return response;
    }
    return {

        getStockOutletSalesLedger,
        stockAllOutletLedgerOutletSales

    };
}

module.exports = stockOutletSalesRepo;
