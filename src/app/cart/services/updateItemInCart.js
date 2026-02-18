const cartRepo = require("../repository/cart");
const getCartService = require("./getCart");

function updateItemInCartService(fastify) {
  const { updateQuantityOfItemInCart, deleteItemFromCart } = cartRepo(fastify);
  const getCart = getCartService(fastify);

  return async ({ logTrace, body, userDetails }) => {
    const { products_code, units_id, cart_quantity } = body;
    const customers_id = userDetails.result.id;

    const knex = fastify.knexMedical;

    if (cart_quantity === 0) {
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
    }

    await updateQuantityOfItemInCart.call(knex, {
      logTrace,
      input: {
        units_id,
        products_code,
        customers_id,
        cart_quantity
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
module.exports = updateItemInCartService;
