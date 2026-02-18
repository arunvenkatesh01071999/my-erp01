const cartRepo = require("../repository/cart");

const getMapFromArray = ({ inputArr, keyProperty }) => {
  return inputArr.reduce((acc, val) => {
    acc[val[keyProperty]] = val;
    return acc;
  }, {});
};

function getCartService(fastify) {
  const { getItemsInCart, updateCartItemRate } = cartRepo(fastify);

  // async function refreshCartLinePricesInDb({
  //   knexOrder,
  //   customer_id,
  //   outlet_id,
  //   cart_lines,
  //   logTrace
  // }) {
  //   const promises = cart_lines.map(cart_line => {
  //     return updateCartItemRate.call(knexOrder, {
  //       input: {
  //         pack_id: cart_line.unit_id,
  //         product_code: cart_line.product_code,
  //         customer_id,
  //         rate: cart_line.prod_rate,
  //         outlet_id
  //       },
  //       logTrace
  //     });
  //   });

  //   await Promise.all(promises);
  // }

  return async ({ logTrace, query, userDetails }) => {
    let { customers_id, refresh_cart_item_prices_flag = true } = query;
    const knex = fastify.knexMedical;
    if (!customers_id) {
      customers_id = userDetails.result.id;
    }
    console.log(`userDetails in Get Carts :${customers_id}`);

    const cartItems = await getItemsInCart.call(knex, {
      logTrace,
      input: { customers_id }
    });

    if (!cartItems.cart_lines.length) {
      return {
        cart_lines: []
      };
    }

    // if (refresh_cart_item_prices_flag) {
    //   await refreshCartLinePricesInDb({
    //     knexOrder,
    //     customer_id,
    //     outlet_id,
    //     cart_lines,
    //     logTrace
    //   });
    // }
    const { cart_lines } = cartItems;
    const cart_total = cartItems.cart_lines.reduce((acc, cartLine) => {
      return acc + parseFloat(cartLine.cart_items_total);
    }, 0);

    const cart_total_savings = cartItems.cart_lines.reduce((acc, cartLine) => {
      return acc + parseFloat(cartLine.cart_items_total_savings);
    }, 0);
    const cart_total_quantity = cartItems.cart_lines.reduce((acc, cartLine) => {
      return acc + parseFloat(cartLine.cart_quantity);
    }, 0);
    const packing_weight = cartItems.cart_lines.reduce((acc, cartLine) => {
      return acc + parseFloat(cartLine.packing_weight);
    }, 0);

    const cart_total_items = cartItems.cart_lines.length;

    const cartResponse = {
      cart_lines,
      cart_total,
      cart_total_savings: cart_total_savings.toFixed(2),
      cart_total_quantity,
      cart_total_items,
      cart_total_packing_weight: packing_weight
    };

    return cartResponse;
  };
}
module.exports = getCartService;
