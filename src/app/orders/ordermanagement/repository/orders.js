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
const { MAIN_CATEGORY } = require("../commons/constants");

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
    admin_user_id
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
        );

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

      return orderdetails;
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
  async function getOrderPaginate({
    params,
    logTrace,
    page_size,
    current_page
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
        );
      if (params.status) {
        query.where(ORDERS_MASTERS.COLUMNS.ORDERS_STATUS, params.status);
      }
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
  async function getOrderStatus({ logTrace }) {
    const knex = this;

    const query = knex(ORDERS_MASTERS.NAME)
      .select(ORDERS_MASTERS.COLUMNS.ORDERS_STATUS)
      .count("*")
      .groupBy(ORDERS_MASTERS.COLUMNS.ORDERS_STATUS)
      .orderBy(ORDERS_MASTERS.COLUMNS.ORDERS_STATUS);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get order status count",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Order status not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }
  async function OrderStatusChange({ body, params, logTrace }) {
    const knex = this;
    const query = knex(ORDERS_MASTERS.NAME).where(
      ORDERS_MASTERS.COLUMNS.ID,
      body.order_id
    );

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Orders not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${ORDERS_MASTERS.NAME}`)
      .where(`${ORDERS_MASTERS.COLUMNS.ID}`, body.order_id)
      .update({
        [ORDERS_MASTERS.COLUMNS.ORDERS_STATUS]: body.status
      });

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while updating Order Status",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    return { success: true, message: "order staus has been changed" };
  }
  async function getOrdersByYear({ params, logTrace }) {
    const knex = this;

    const query = knex(ORDERS_MASTERS.NAME)
      .select(
        knex.raw("TO_CHAR(created_at, 'Mon') AS month"),
        knex.raw("EXTRACT(month FROM created_at) AS month_number"),
        knex.raw("EXTRACT(year FROM created_at) AS year"),
        knex.raw("COUNT(*) AS no_of_order"),
        knex.raw("SUM(orders_total) AS amount")
      )
      .groupByRaw(
        "TO_CHAR(created_at, 'Mon'), EXTRACT(year FROM created_at),EXTRACT(month FROM created_at)"
      )
      .where(knex.raw("EXTRACT(year FROM created_at) = ?", params.year))
      .where(`${ORDERS_MASTERS.COLUMNS.ORDERS_STATUS}`, 4)
      .orderByRaw("year, month_number");
    logQuery({
      logger: fastify.log,
      query,
      context: "Get orders year sales",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Order  not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }
  async function getOrdersBySalesMonth({ params, logTrace }) {
    const knex = this;

    const query = knex(ORDERS_MASTERS.NAME)
      .select(
        knex.raw("DATE(created_at) AS date"),
        knex.raw("COUNT(*) AS no_of_order"),
        knex.raw("SUM(orders_total) AS amount")
      )
      // .where(knex.raw("EXTRACT(month FROM created_at) = ?", params.month))
      .where(knex.raw("TO_CHAR(created_at, 'Mon')  = ?", params.month))
      .where(knex.raw("EXTRACT(year FROM created_at) = ?", params.year))
      .groupByRaw("DATE(created_at)")
      .orderByRaw("DATE(created_at)");

    logQuery({
      logger: fastify.log,
      query,
      context: "Get orders month sales",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Order not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }
  async function getOrderPaginateByDate({
    params,
    logTrace,
    page_size,
    current_page
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
        .where(ORDERS_MASTERS.COLUMNS.ORDERS_STATUS, 4)
        .whereRaw(
          `DATE(${ORDERS_MASTERS.NAME}.${ORDERS_MASTERS.COLUMNS.CREATED_AT}) = ?`,
          [params.date]
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
  async function getItemsSales({
    body,
    logTrace,
    page_size,
    current_page,
    admin_user_id
  }) {
    const knex = this;
    const query = knex
      .select([
        `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.PRODUCT_LONG_DESCRIPTION}`,
        `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.PRODUCT_SHORT_DESCRIPTION}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_LONG_NAME}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
        knex.raw(
          `SUM(${ORDERS_DETAILS.NAME}.${ORDERS_DETAILS.COLUMNS.ORDERS_ITEMS_TOTAL}) as total`
        ),
        knex.raw(
          `SUM(${ORDERS_DETAILS.NAME}.${ORDERS_DETAILS.COLUMNS.ORDERS_QUANTITY}) as quantity`
        )
      ])
      .from(`${ORDERS_DETAILS.NAME} as ${ORDERS_DETAILS.NAME}`)
      .leftJoin(
        `${PRODUCTS.NAME} as ${PRODUCTS.NAME}`,
        `${ORDERS_DETAILS.NAME}.${ORDERS_DETAILS.COLUMNS.PRODUCTS_CODE}`,
        `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.PRODUCT_CODE}`
      )
      .leftJoin(
        `${UNITS.NAME} as ${UNITS.NAME}`,
        `${ORDERS_DETAILS.NAME}.${ORDERS_DETAILS.COLUMNS.UNITS_ID}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
      )
      .whereRaw(
        `DATE(${ORDERS_DETAILS.NAME}.${ORDERS_DETAILS.COLUMNS.CREATED_AT}) >= ?`,
        [body.from_date]
      )
      .whereRaw(
        `DATE(${ORDERS_DETAILS.NAME}.${ORDERS_DETAILS.COLUMNS.CREATED_AT}) <= ?`,
        [body.to_date]
      )
      .groupBy(
        `${ORDERS_DETAILS.COLUMNS.PRODUCTS_CODE}`,
        `${ORDERS_DETAILS.COLUMNS.UNITS_ID}`,
        `${PRODUCTS.COLUMNS.PRODUCT_SHORT_DESCRIPTION}`,
        `${PRODUCTS.COLUMNS.PRODUCT_LONG_DESCRIPTION}`,
        `${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
        `${UNITS.COLUMNS.UNITS_LONG_NAME}`
      );

    logQuery({
      logger: fastify.log,
      query,
      context: "Item wise sales details",
      logTrace
    });

    const response = await query.paginate({
      pageSize: page_size, // Customize as needed
      currentPage: current_page // Customize as needed
    });

    if (response.meta.pagination.total_pages < current_page) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Requested page is beyond the available data",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Item wise sales not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }
  async function getCategorySales({
    body,
    logTrace,
    page_size,
    current_page,
    admin_user_id
  }) {
    const knex = this;
    const query = knex
      .select([
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_IMAGE}`,
        knex.raw(
          `SUM(${ORDERS_DETAILS.NAME}.${ORDERS_DETAILS.COLUMNS.ORDERS_ITEMS_TOTAL}) as total`
        ),
        knex.raw(
          `SUM(${ORDERS_DETAILS.NAME}.${ORDERS_DETAILS.COLUMNS.ORDERS_QUANTITY}) as quantity`
        )
      ])
      .from(`${ORDERS_DETAILS.NAME} as ${ORDERS_DETAILS.NAME}`)
      .leftJoin(
        `${PRODUCTS.NAME} as ${PRODUCTS.NAME}`,
        `${ORDERS_DETAILS.NAME}.${ORDERS_DETAILS.COLUMNS.PRODUCTS_CODE}`,
        `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.PRODUCT_CODE}`
      )
      .leftJoin(
        `${UNITS.NAME} as ${UNITS.NAME}`,
        `${ORDERS_DETAILS.NAME}.${ORDERS_DETAILS.COLUMNS.UNITS_ID}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
      )
      .leftJoin(
        `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
        `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.MAIN_CATEGORY_ID}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
      )
      .whereRaw(
        `DATE(${ORDERS_DETAILS.NAME}.${ORDERS_DETAILS.COLUMNS.CREATED_AT}) >= ?`,
        [body.from_date]
      )
      .whereRaw(
        `DATE(${ORDERS_DETAILS.NAME}.${ORDERS_DETAILS.COLUMNS.CREATED_AT}) <= ?`,
        [body.to_date]
      )
      .groupBy(
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_IMAGE}`
      );
    logQuery({
      logger: fastify.log,
      query,
      context: "Category wise sales details",
      logTrace
    });

    const response = await query.paginate({
      pageSize: page_size, // Customize as needed
      currentPage: current_page // Customize as needed
    });

    if (response.meta.pagination.total_pages < current_page) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Requested page is beyond the available data",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Category Sales not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  return {
    placeOrder,
    getOrder,
    getOrderById,
    getOrderPaginate,
    getOrderStatus,
    OrderStatusChange,
    getOrdersByYear,
    getOrdersBySalesMonth,
    getOrderPaginateByDate,
    getItemsSales,
    getCategorySales
  };
}

module.exports = ordersRepo;
