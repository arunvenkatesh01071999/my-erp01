const partyledgerRepo = require("../repository/partyledger");

function updateLedgerService(fastify) {
  const { updatePartyLedger } = partyledgerRepo(fastify);

  return async ({ logTrace, query, userDetails }) => {
    let { customers_id, refresh_cart_item_prices_flag = true } = query;

    const knex = fastify.knexMedical;

    const response = await updatePartyLedger.call(knex, {
      logTrace,
      input: { customers_id }
    });

    return response;
  };

  //   const updatePartyLedger = await getCart({
  //     logTrace,
  //     query: {
  //       PartyCode,
  //       Debit: purchase_master_total_amount,
  //       Type: `Purchase - bill of docs number`,
  //       Credit: 0,
  //       Mode:''
  //     }
  //   });
}
module.exports = updateLedgerService;
