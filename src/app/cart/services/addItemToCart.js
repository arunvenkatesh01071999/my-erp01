const cartRepo = require("../repository/cart");

const productServices = require("../../catalog/products/services/productServices");
const getCartService = require("./getCart");

function addToCartService(fastify) {
  const { addItemToCart, getQuantityOfItemInCart, updateQuantityOfItemInCart } =
    cartRepo(fastify);

  const { getPriceSingleProduct } = productServices.getPriceService(fastify);
  const getCart = getCartService(fastify);

  return async ({ logTrace, body, userDetails }) => {
    const { products_code, units_id, cart_quantity } = body;
    const customers_id = userDetails.result.id;
    const knex = fastify.knexMedical;

    const existingItemInfo = await getQuantityOfItemInCart.call(knex, {
      logTrace,
      input: { units_id, products_code, customers_id }
    });
    const priceInformation = await getPriceSingleProduct({
      logTrace,
      body: { products_code, units_id }
    });

    if (existingItemInfo) {
      await updateQuantityOfItemInCart.call(knex, {
        logTrace,
        input: {
          units_id,
          products_code,
          customers_id,
          cart_quantity:
            Number(existingItemInfo.cart_quantity) + Number(cart_quantity)
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

    await addItemToCart.call(knex, {
      logTrace,
      input: {
        units_id,
        products_code,
        customers_id,
        cart_quantity,
        products_rate: priceInformation.sales_price
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
module.exports = addToCartService;
