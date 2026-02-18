const cartRepo = require("../repository/cart");

const getCartService = require("./getCart");

function deleteItemFromCartService(fastify) {
  const { deleteItemFromCart } = cartRepo(fastify);
  const getCart = getCartService(fastify);

  return async ({ logTrace, body, userDetails }) => {
    const { units_id, products_code } = body;
    const customers_id = userDetails.result.id;
    const knex = fastify.knexMedical;

    await deleteItemFromCart.call(knex, {
      logTrace,
      input: {
        units_id,
        products_code,
        customers_id
      }
    });

    return getCart({
      logTrace,
      query: {
        customers_id,
        refresh_cart_item_prices_flag: false
      }
    });
  };
}
module.exports = deleteItemFromCartService;
