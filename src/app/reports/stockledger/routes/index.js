const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

    fastify.route({
        method: "POST",
        url: "/reports/stock/ledger",
        // schema: schemas.stockLedgerSchema,
        preHandler: fastify.authenticate,
        handler: handlers.stockLedgerHandler(fastify)
    });

    //     SELECT  pro_code, pro_name,prod_id,sum(purchase_qty) as purchase,sum(sale_qty)as sales,
    // sum(purchase_return_qty)as purchasereturn,sum(wastage_qty)as waste,sum(adjust_qty)as adjust,
    // sum(free_qty)as free,sum(sales_in_qty) as  inQty,sum(sales_return_qty) as salesreturn,
    // (select (sum(purchase_qty-sale_qty-purchase_return_qty-wastage_qty+adjust_qty+free_qty+sales_in_qty+sales_return_qty))
    // from stockledger as b  where b.prod_id=a.prod_id  and date(b.date) < '2023-02-05' ) as openQty,
    // (sum(purchase_qty-sale_qty-purchase_return_qty-wastage_qty+adjust_qty+free_qty+sales_in_qty+sales_return_qty)) as closing
    // from stockledger as a
    // INNER join item as c  ON c.id=a.prod_id
    // Where date(a.date) >= '2023-02-05' AND  date(a.date) <= '2024-02-05' 
    // GROUP by pro_code,pro_name,prod_id

};
