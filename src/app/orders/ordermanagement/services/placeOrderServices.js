const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const ordersRepo = require("../repository/orders");
const getCartService = require("../../../cart/services/getCart");

function placeOrderService(fastify) {
  const { placeOrder } = ordersRepo(fastify);

  const getCart = getCartService(fastify);

  return async ({ body, query, logTrace, userDetails }) => {
    const { address_id, order_mode, order_type } = body;
    const customers_id = userDetails.result.id;
    const knex = fastify.knexMedical;

    const cartItems = await getCart({
      logTrace,
      query: {
        customers_id,
        refresh_cart_item_prices_flag: false
      }
    });
    // console.log("cartItems" + cartItems.cart_lines.length);
    if (cartItems.cart_lines.length <= 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "No Cart items found. add items to cart and proceed",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }
    const response = await placeOrder.call(knex, {
      logTrace,
      input: {
        address_id,
        customers_id,
        orders_total: cartItems.cart_total,
        orders_discount_amount: cartItems.cart_total_savings,
        orders_no_of_items: cartItems.cart_total_items,
        orders_items_qty: cartItems.cart_total_quantity,
        orders_weight: cartItems.cart_total_packing_weight,
        orders_delivery_charge: 0,
        orders_type: order_type,
        orders_mode: order_mode,
        orders_status: 0,
        orders_transactions_id: "Nil",
        orders_details: cartItems.cart_lines
      }
    });
    return response;
  };
}
module.exports = placeOrderService;
