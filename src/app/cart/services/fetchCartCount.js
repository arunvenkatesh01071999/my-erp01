const cartRepo = require("../repository/cart");

function fetchCartCountService(fastify) {
  const { getCartItemsForCartCount } = cartRepo(fastify);

  return async ({ logTrace, query, userDetails }) => {
    const knex = fastify.knexMedical;
    const customers_id = userDetails.result.id;

    const response = await getCartItemsForCartCount.call(knex, {
      customers_id,
      logTrace
    });

    // const transformedResponse = response.map(item => {
    //   return {
    //     products_code: item.products_code,
    //     units_id: items.units_id,
    //     cart_quantity: item.cart_quantity
    //   };
    // });
    const cart_lines = response;
    const cart_total_quantity = response.reduce((acc, cartLine) => {
      return acc + parseFloat(cartLine.cart_quantity);
    }, 0);

    const cart_total_items = response.length;
    const result = {
      cart_lines,
      cart_total_quantity,
      cart_total_items
    };
    return result;
  };
}
module.exports = fetchCartCountService;
