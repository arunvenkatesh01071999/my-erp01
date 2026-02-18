const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");

const { logQuery } = require("../../../commons/helpers");
const { ORDERS_MASTERS } = require("../commons/constants");
const { ORDERS_DETAILS } = require("../commons/constants");
const { CUSTOMERS } = require("../commons/constants");
const { CUSTOMERS_ADDRESS } = require("../commons/constants");
const { ADDRESS_TYPE } = require("../commons/constants");
const { UNITS } = require("../commons/constants");
const { PRODUCTS } = require("../commons/constants");
const { PRODUCTS_IMAGES } = require("../commons/constants");
const { CART } = require("../commons/constants");

function ordersRepo(fastify) {
  async function placeOrder({
    logTrace,
    input: {
      address_id,
      customers_id,
      orders_total,
      orders_discount_amount,
      orders_no_of_items,
      orders_items_qty,
      orders_weight,
      orders_delivery_charge,
      orders_type,
      orders_mode,
      orders_status,
      orders_transactions_id,
      orders_details
    }
  }) {
    const knex = this;
    const query_insert = await knex(`${ORDERS_MASTERS.NAME}`)
      .returning("id")
      .insert({
        [ORDERS_MASTERS.COLUMNS.CUSTOMERS_ID]: customers_id,
        [ORDERS_MASTERS.COLUMNS.ADDRESS_ID]: address_id,
        [ORDERS_MASTERS.COLUMNS.ORDERS_TOTAL]: orders_total,
        [ORDERS_MASTERS.COLUMNS.ORDERS_DISCOUNT_AMOUNT]: orders_discount_amount,
        [ORDERS_MASTERS.COLUMNS.ORDERS_NO_OF_ITEMS]: orders_no_of_items,
        [ORDERS_MASTERS.COLUMNS.ORDERS_ITEMS_QTY]: orders_items_qty,
        [ORDERS_MASTERS.COLUMNS.ORDERS_WEIGHT]: orders_weight,
        [ORDERS_MASTERS.COLUMNS.ORDERS_DELIVERY_CHARGE]: orders_delivery_charge,
        [ORDERS_MASTERS.COLUMNS.ORDERS_TYPE]: orders_type,
        [ORDERS_MASTERS.COLUMNS.ORDERS_MODE]: orders_mode,
        [ORDERS_MASTERS.COLUMNS.ORDERS_STATUS]: orders_status,
        [ORDERS_MASTERS.COLUMNS.ORDERS_TRANSACTIONS_ID]: orders_transactions_id
      });

    const response = await query_insert;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while placing the orders",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }
    const orders_id = response[0].id; // productId is auto-generated

    const orders_lines = orders_details.map(orderline => ({
      [ORDERS_DETAILS.COLUMNS.ORDERS_ID]: orders_id,
      [ORDERS_DETAILS.COLUMNS.CUSTOMERS_ID]: customers_id,
      [ORDERS_DETAILS.COLUMNS.ORDERS_ITEMS_TOTAL]: orderline.cart_items_total,
      [ORDERS_DETAILS.COLUMNS.ORDERS_ITEMS_DISCOUNT]:
        orderline.cart_items_total_savings,
      [ORDERS_DETAILS.COLUMNS.PRODUCTS_CODE]: orderline.products_code,
      [ORDERS_DETAILS.COLUMNS.UNITS_ID]: orderline.units_id,
      [ORDERS_DETAILS.COLUMNS.ORDERS_QUANTITY]: orderline.cart_quantity,
      [ORDERS_DETAILS.COLUMNS.ORDERS_RATE]: orderline.sales_price,
      [ORDERS_DETAILS.COLUMNS.ORDERS_GST]: orderline.gst,
      [ORDERS_DETAILS.COLUMNS.ORDERS_IGST]: orderline.igst,
      [ORDERS_DETAILS.COLUMNS.ORDERS_CESS]: orderline.cess
    }));

    const insertedOrderLines = await knex(`${ORDERS_DETAILS.NAME}`).insert(
      orders_lines
    );

    const delete_query = await knex(CART.NAME)
      .where(CART.COLUMNS.CUSTOMERS_ID, customers_id)
      .del();
    if (!insertedOrderLines) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating Order Details",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    return {
      success: true,
      message: "Your order has been placed sucessfully",
      order_number: orders_id
    };
  }
  async function getOrder({
    body,
    logTrace,
    page_size,
    current_page,
    customers_id
  }) {
    const knex = this;
    const response = await knex.transaction(async trx => {
      // Fetch products
      const query = knex
        .select([
          `${ORDERS_MASTERS.NAME}.*`,
          `${CUSTOMERS_ADDRESS.NAME}.${CUSTOMERS_ADDRESS.COLUMNS.CUSTOMERS_ID}`,
          `${CUSTOMERS_ADDRESS.NAME}.${CUSTOMERS_ADDRESS.COLUMNS.ADDRESS_TYPE}`,
          `${CUSTOMERS_ADDRESS.NAME}.${CUSTOMERS_ADDRESS.COLUMNS.ADDRESS_LINE1}`,
          `${CUSTOMERS_ADDRESS.NAME}.${CUSTOMERS_ADDRESS.COLUMNS.ADDRESS_LINE2}`,
          `${CUSTOMERS_ADDRESS.NAME}.${CUSTOMERS_ADDRESS.COLUMNS.ADDRESS_LINE3}`,
          `${CUSTOMERS_ADDRESS.NAME}.${CUSTOMERS_ADDRESS.COLUMNS.ALTERNATIVE_MOBILE}`,
          `${CUSTOMERS_ADDRESS.NAME}.${CUSTOMERS_ADDRESS.COLUMNS.LONGITUDE}`,
          `${CUSTOMERS_ADDRESS.NAME}.${CUSTOMERS_ADDRESS.COLUMNS.LATITUDE}`,
          `${CUSTOMERS_ADDRESS.NAME}.${CUSTOMERS_ADDRESS.COLUMNS.STATE}`,
          `${CUSTOMERS_ADDRESS.NAME}.${CUSTOMERS_ADDRESS.COLUMNS.CITY}`,
          `${CUSTOMERS_ADDRESS.NAME}.${CUSTOMERS_ADDRESS.COLUMNS.COUNTRY}`,
          `${CUSTOMERS_ADDRESS.NAME}.${CUSTOMERS_ADDRESS.COLUMNS.IS_DEFAULT}`,
          `${ADDRESS_TYPE.NAME}.${ADDRESS_TYPE.COLUMNS.ADDRESS_TYPE}`
        ])
        .from(`${ORDERS_MASTERS.NAME} as ${ORDERS_MASTERS.NAME}`)
        .leftJoin(
          `${CUSTOMERS_ADDRESS.NAME} as ${CUSTOMERS_ADDRESS.NAME}`,
          `${ORDERS_MASTERS.NAME}.${ORDERS_MASTERS.COLUMNS.ADDRESS_ID}`,
          `${CUSTOMERS_ADDRESS.NAME}.${CUSTOMERS_ADDRESS.COLUMNS.ID}`
        )
        .leftJoin(
          `${ADDRESS_TYPE.NAME} as ${ADDRESS_TYPE.NAME}`,
          `${CUSTOMERS_ADDRESS.NAME}.${CUSTOMERS_ADDRESS.COLUMNS.ADDRESS_TYPE}`,
          `${ADDRESS_TYPE.NAME}.${ADDRESS_TYPE.COLUMNS.ID}`
        )
        .where(
          `${ORDERS_MASTERS.NAME}.${ORDERS_MASTERS.COLUMNS.CUSTOMERS_ID}`,
          customers_id
        );

      logQuery({
        logger: fastify.log,
        query,
        context: "Get orders list details",
        logTrace
      });

      const orders = await query.paginate({
        pageSize: page_size, // Customize as needed
        currentPage: current_page // Customize as needed
      });
      if (orders.meta.pagination.total_pages < current_page) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "Requested page is beyond the available data",
          property: "",
          code: "NOT_ACCEPTABLE"
        });
      }
      if (!orders.data.length) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Orders not found",
          property: "",
          code: "NOT_FOUND"
        });
      }
      console.log("orders" + JSON.stringify(orders));
      const orderdetails = await Promise.all(
        orders.data.map(async order => {
          const order_lines = await trx(ORDERS_DETAILS.NAME)
            .join(
              UNITS.NAME,
              `${ORDERS_DETAILS.NAME}.${ORDERS_DETAILS.COLUMNS.UNITS_ID}`,
              "=",
              `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
            )
            .join(
              PRODUCTS.NAME,
              `${ORDERS_DETAILS.NAME}.${ORDERS_DETAILS.COLUMNS.PRODUCTS_CODE}`,
              "=",
              `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.PRODUCT_CODE}`
            )
            .join(
              PRODUCTS_IMAGES.NAME,
              `${ORDERS_DETAILS.NAME}.${ORDERS_DETAILS.COLUMNS.PRODUCTS_CODE}`,
              "=",
              `${PRODUCTS_IMAGES.NAME}.${PRODUCTS_IMAGES.COLUMNS.PRODUCT_CODE}`
            )
            .where(ORDERS_DETAILS.COLUMNS.ORDERS_ID, order.id)
            .select(
              `${ORDERS_DETAILS.NAME}.*`,
              `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
              `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_LONG_NAME}`,
              `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.PRODUCT_SHORT_DESCRIPTION}`,
              `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.PRODUCT_LONG_DESCRIPTION}`,
              `${PRODUCTS_IMAGES.NAME}.${PRODUCTS_IMAGES.COLUMNS.PRODUCT_IMAGE}`
            );

          return {
            ...order,
            order_lines
          };
        })
      );

      return {
        data: orderdetails,
        meta: orders.meta
      };
    });

    return response;
  }
  async function getOrderById({ logTrace, customers_id, order_id }) {
    const knex = this;
    const response = await knex.transaction(async trx => {
      // Fetch products
      const query = knex
        .select([
          `${ORDERS_MASTERS.NAME}.*`,
          `${CUSTOMERS_ADDRESS.NAME}.${CUSTOMERS_ADDRESS.COLUMNS.CUSTOMERS_ID}`,
          `${CUSTOMERS_ADDRESS.NAME}.${CUSTOMERS_ADDRESS.COLUMNS.ADDRESS_TYPE}`,
          `${CUSTOMERS_ADDRESS.NAME}.${CUSTOMERS_ADDRESS.COLUMNS.ADDRESS_LINE1}`,
          `${CUSTOMERS_ADDRESS.NAME}.${CUSTOMERS_ADDRESS.COLUMNS.ADDRESS_LINE2}`,
          `${CUSTOMERS_ADDRESS.NAME}.${CUSTOMERS_ADDRESS.COLUMNS.ADDRESS_LINE3}`,
          `${CUSTOMERS_ADDRESS.NAME}.${CUSTOMERS_ADDRESS.COLUMNS.ALTERNATIVE_MOBILE}`,
          `${CUSTOMERS_ADDRESS.NAME}.${CUSTOMERS_ADDRESS.COLUMNS.LONGITUDE}`,
          `${CUSTOMERS_ADDRESS.NAME}.${CUSTOMERS_ADDRESS.COLUMNS.LATITUDE}`,
          `${CUSTOMERS_ADDRESS.NAME}.${CUSTOMERS_ADDRESS.COLUMNS.STATE}`,
          `${CUSTOMERS_ADDRESS.NAME}.${CUSTOMERS_ADDRESS.COLUMNS.CITY}`,
          `${CUSTOMERS_ADDRESS.NAME}.${CUSTOMERS_ADDRESS.COLUMNS.COUNTRY}`,
          `${CUSTOMERS_ADDRESS.NAME}.${CUSTOMERS_ADDRESS.COLUMNS.IS_DEFAULT}`,
          `${ADDRESS_TYPE.NAME}.${ADDRESS_TYPE.COLUMNS.ADDRESS_TYPE}`
        ])
        .from(`${ORDERS_MASTERS.NAME} as ${ORDERS_MASTERS.NAME}`)
        .leftJoin(
          `${CUSTOMERS_ADDRESS.NAME} as ${CUSTOMERS_ADDRESS.NAME}`,
          `${ORDERS_MASTERS.NAME}.${ORDERS_MASTERS.COLUMNS.ADDRESS_ID}`,
          `${CUSTOMERS_ADDRESS.NAME}.${CUSTOMERS_ADDRESS.COLUMNS.ID}`
        )
        .leftJoin(
          `${ADDRESS_TYPE.NAME} as ${ADDRESS_TYPE.NAME}`,
          `${CUSTOMERS_ADDRESS.NAME}.${CUSTOMERS_ADDRESS.COLUMNS.ADDRESS_TYPE}`,
          `${ADDRESS_TYPE.NAME}.${ADDRESS_TYPE.COLUMNS.ID}`
        )
        .where(`${ORDERS_MASTERS.NAME}.${ORDERS_MASTERS.COLUMNS.ID}`, order_id);

      logQuery({
        logger: fastify.log,
        query,
        context: "Get orders list details",
        logTrace
      });

      const orders = await query;
      if (!orders.length) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Orders not found",
          property: "",
          code: "NOT_FOUND"
        });
      }

      const orderdetails = await Promise.all(
        orders.map(async order => {
          const order_lines = await trx(ORDERS_DETAILS.NAME)
            .join(
              UNITS.NAME,
              `${ORDERS_DETAILS.NAME}.${ORDERS_DETAILS.COLUMNS.UNITS_ID}`,
              "=",
              `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
            )
            .join(
              PRODUCTS.NAME,
              `${ORDERS_DETAILS.NAME}.${ORDERS_DETAILS.COLUMNS.PRODUCTS_CODE}`,
              "=",
              `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.PRODUCT_CODE}`
            )
            .join(
              PRODUCTS_IMAGES.NAME,
              `${ORDERS_DETAILS.NAME}.${ORDERS_DETAILS.COLUMNS.PRODUCTS_CODE}`,
              "=",
              `${PRODUCTS_IMAGES.NAME}.${PRODUCTS_IMAGES.COLUMNS.PRODUCT_CODE}`
            )
            .where(ORDERS_DETAILS.COLUMNS.ORDERS_ID, order.id)
            .select(
              `${ORDERS_DETAILS.NAME}.*`,
              `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
              `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_LONG_NAME}`,
              `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.PRODUCT_SHORT_DESCRIPTION}`,
              `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.PRODUCT_LONG_DESCRIPTION}`,
              `${PRODUCTS_IMAGES.NAME}.${PRODUCTS_IMAGES.COLUMNS.PRODUCT_IMAGE}`
            );

          return {
            ...order,
            order_lines
          };
        })
      );

      return orderdetails[0];
    });

    return response;
  }
  return { placeOrder, getOrder, getOrderById };
}

module.exports = ordersRepo;
