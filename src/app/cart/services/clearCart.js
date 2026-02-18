const cartRepo = require("../repository/cart");

function clearCartService(fastify) {
  const { clearCartItems } = cartRepo(fastify);

  return async ({ logTrace, query, userDetails }) => {
    const knex = fastify.knexMedical;
    const customers_id = userDetails.result.id;
    await clearCartItems.call(knex, {
      customers_id,
      logTrace
    });

    return { success: "true" };
  };
}
module.exports = clearCartService;
