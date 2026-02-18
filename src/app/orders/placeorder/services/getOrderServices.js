const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const ordersRepo = require("../repository/orders");

function getOrderService(fastify) {
  const { getOrder } = ordersRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const customers_id = userDetails.result.id;
    const knex = fastify.knexMedical;

    const response = await getOrder.call(knex, {
      logTrace,
      page_size: params.page_size,
      current_page: params.current_page,
      customers_id
    });
    const transformedResponse = {
      data: response.data.map(item => {
        let status_name;
        switch (item.orders_status) {
          case 0:
            status_name = "NEWORDER";
            break;
          case 1:
            status_name = "PROCESSING";
            break;
          case 2:
            status_name = "INVOICE";
            break;
          case 3:
            status_name = "TRANSISTS";
            break;
          case 4:
            status_name = "DELIVERED";
            break;
          case 5:
            status_name = "CANCELLED";
            break;

          default:
            status_name = ""; // Default value if no match
            break;
        }
        return {
          orders_status_text: status_name,
          ...item
        };
      }),
      meta: response.meta
    };
    return transformedResponse;
  };
}
function getOrderByIdService(fastify) {
  const { getOrderById } = ordersRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const customers_id = userDetails.result.id;
    const knex = fastify.knexMedical;

    const response = await getOrderById.call(knex, {
      logTrace,
      customers_id,
      order_id: params.order_id
    });
    let status_name;
    switch (response.orders_status) {
      case 0:
        status_name = "NEWORDER";
        break;
      case 1:
        status_name = "PROCESSING";
        break;
      case 2:
        status_name = "INVOICE";
        break;
      case 3:
        status_name = "TRANSISTS";
        break;
      case 4:
        status_name = "DELIVERED";
        break;
      case 5:
        status_name = "CANCELLED";
        break;

      default:
        status_name = ""; // Default value if no match
        break;
    }
    return {
      orders_status_text: status_name,
      ...response
    };
    // return response;
  };
}
module.exports = { getOrderService, getOrderByIdService };
