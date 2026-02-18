const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler");

const { logQuery } = require("../../commons/helpers");
const { CART } = require("../commons/constants");
const { PRODUCTS } = require("../../catalog/products/commons/constants");
const {
  PRODUCTS_VARIANTS
} = require("../../catalog/products/commons/constants");
const { MAIN_CATEGORY } = require("../../catalog/products/commons/constants");
const { SUB_CATEGORY } = require("../../catalog/products/commons/constants");
const { BRANDS } = require("../../catalog/products/commons/constants");
const { UNITS } = require("../../catalog/products/commons/constants");
const { GROUPS } = require("../../catalog/products/commons/constants");
const { PRODUCTS_IMAGES } = require("../../catalog/products/commons/constants");

function customerCartRepo(fastify) {
  async function getQuantityOfItemInCart({
    logTrace,
    input: { units_id, products_code, customers_id }
  }) {
    const knex = this;
    const query = knex(CART.NAME)
      .select(CART.COLUMNS.CART_QUANTITY)
      .where(CART.COLUMNS.UNITS_ID, units_id)
      .where(CART.COLUMNS.PRODUCTS_CODE, products_code)
      .where(CART.COLUMNS.CUSTOMERS_ID, customers_id);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Quantity of Item In Cart",
      logTrace
    });
    const response = await query;
    return response[0];
  }

  async function updateQuantityOfItemInCart({
    logTrace,
    input: { units_id, products_code, customers_id, cart_quantity }
  }) {
    const knex = this;
    const query = knex(CART.NAME)
      .update({
        [CART.COLUMNS.CART_QUANTITY]: cart_quantity,
        [CART.COLUMNS.UPDATED_AT]: new Date().toISOString()
      })
      .where(CART.COLUMNS.UNITS_ID, units_id)
      .where(CART.COLUMNS.PRODUCTS_CODE, products_code)
      .where(CART.COLUMNS.CUSTOMERS_ID, customers_id);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Quantity of Item In Cart",
      logTrace
    });
    const response = await query;
    return response[0];
  }

  async function addItemToCart({
    logTrace,
    input: {
      units_id,
      products_code,
      customers_id,
      cart_quantity,
      products_rate
    }
  }) {
    const knex = this;
    const query = knex(CART.NAME).insert({
      [CART.COLUMNS.UNITS_ID]: units_id,
      [CART.COLUMNS.PRODUCTS_CODE]: products_code,
      [CART.COLUMNS.CUSTOMERS_ID]: customers_id,
      [CART.COLUMNS.PRODUCTS_RATE]: products_rate,
      [CART.COLUMNS.CART_QUANTITY]: cart_quantity
    });
    logQuery({
      logger: fastify.log,
      query,
      context: "Add Item To Cart",
      logTrace
    });
    await query;
    return { success: true };
  }

  async function updateCartItemRate({
    logTrace,
    input: { pack_id, product_code, customer_id, rate, outlet_id }
  }) {
    const knex = this;
    const query = knex(CART.NAME)
      .update({
        [CART.COLUMNS.RATE]: rate
      })
      .where({
        [CART.COLUMNS.PACK_ID]: pack_id,
        [CART.COLUMNS.PROD_ID]: product_code,
        [CART.COLUMNS.CUST_ID]: customer_id,
        [CART.COLUMNS.OUTLET_ID]: outlet_id
      });
    logQuery({
      logger: fastify.log,
      query,
      context: "Update Cart Item Rate",
      logTrace
    });
    await query;
    return { success: true };
  }

  async function deleteItemFromCart({
    logTrace,
    input: { units_id, products_code, customers_id }
  }) {
    const knex = this;
    const query = knex(CART.NAME)
      .delete()
      .where(CART.COLUMNS.UNITS_ID, units_id)
      .where(CART.COLUMNS.PRODUCTS_CODE, products_code)
      .where(CART.COLUMNS.CUSTOMERS_ID, customers_id);
    logQuery({
      logger: fastify.log,
      query,
      context: "Delete Item From Cart",
      logTrace
    });
    const response = await query;

    if (response === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "product_id not found in Cart",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return { success: true };
  }

  async function getItemsInCart({ logTrace, input: { customers_id } }) {
    const knex = this;
    const response = await knex.transaction(async trx => {
      // Fetch Carts
      const query = knex
        .select([
          `${CART.NAME}.*`,
          knex.raw(
            `${CART.NAME}.${CART.COLUMNS.CART_QUANTITY} * ${PRODUCTS_VARIANTS.NAME}.${PRODUCTS_VARIANTS.COLUMNS.SALES_PRICE} as cart_items_total`
          ),
          knex.raw(
            `ROUND((${CART.NAME}.${CART.COLUMNS.CART_QUANTITY} * ${PRODUCTS_VARIANTS.NAME}.${PRODUCTS_VARIANTS.COLUMNS.SALES_PRICE} *  ${PRODUCTS_VARIANTS.NAME}.${PRODUCTS_VARIANTS.COLUMNS.DISCOUNT_PERCETAGE} / 100 ),2) as cart_items_total_savings`
          ),

          `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.PRODUCT_LONG_DESCRIPTION}`,
          `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.PRODUCT_SHORT_DESCRIPTION}`,
          `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.IS_ACTIVE} as products_active`,
          `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.STOCK_STATUS} as products_stock_status`,
          `${PRODUCTS_VARIANTS.NAME}.${PRODUCTS_VARIANTS.COLUMNS.STOCK_STATUS} as products_variants_active`,
          `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as units_name`,
          `${PRODUCTS_VARIANTS.NAME}.${PRODUCTS_VARIANTS.COLUMNS.MRP}`,
          `${PRODUCTS_VARIANTS.NAME}.${PRODUCTS_VARIANTS.COLUMNS.SALES_PRICE}`,
          `${PRODUCTS_VARIANTS.NAME}.${PRODUCTS_VARIANTS.COLUMNS.DISCOUNT_PERCETAGE}`,
          `${PRODUCTS_VARIANTS.NAME}.${PRODUCTS_VARIANTS.COLUMNS.DISCOUNT_AMOUNT}`,
          `${PRODUCTS_VARIANTS.NAME}.${PRODUCTS_VARIANTS.COLUMNS.MINIMUM_SALES_QTY}`,
          `${PRODUCTS_VARIANTS.NAME}.${PRODUCTS_VARIANTS.COLUMNS.MAXIMUM_SALES_QTY}`,
          `${PRODUCTS_VARIANTS.NAME}.${PRODUCTS_VARIANTS.COLUMNS.GST}`,
          `${PRODUCTS_VARIANTS.NAME}.${PRODUCTS_VARIANTS.COLUMNS.IGST}`,
          `${PRODUCTS_VARIANTS.NAME}.${PRODUCTS_VARIANTS.COLUMNS.CESS}`,
          `${PRODUCTS_VARIANTS.NAME}.${PRODUCTS_VARIANTS.COLUMNS.PACKING_WEIGHT}`
        ])
        .from(`${CART.NAME} as ${CART.NAME}`)
        .leftJoin(
          `${PRODUCTS.NAME} as ${PRODUCTS.NAME}`,
          `${CART.NAME}.${CART.COLUMNS.PRODUCTS_CODE}`,
          `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.PRODUCT_CODE}`
        )
        .leftJoin(
          `${UNITS.NAME} as ${UNITS.NAME}`,
          `${CART.NAME}.${CART.COLUMNS.UNITS_ID}`,
          `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
        )
        .leftJoin(
          `${PRODUCTS_VARIANTS.NAME} as ${PRODUCTS_VARIANTS.NAME}`,
          function () {
            this.on(
              `${CART.NAME}.${CART.COLUMNS.UNITS_ID}`,
              `${PRODUCTS_VARIANTS.NAME}.${PRODUCTS_VARIANTS.COLUMNS.UNITS_ID}`
            ).andOn(
              `${CART.NAME}.${CART.COLUMNS.PRODUCTS_CODE}`, // Add the additional condition here
              `${PRODUCTS_VARIANTS.NAME}.${PRODUCTS_VARIANTS.COLUMNS.PRODUCTS_CODE}`
            );
          }
        )
        .where(CART.COLUMNS.CUSTOMERS_ID, customers_id);

      logQuery({
        logger: fastify.log,
        query,
        context: "Get Cart details",
        logTrace
      });

      const products = await query;

      const cart_lines = await Promise.all(
        products.map(async product => {
          const products_images = await trx(PRODUCTS_IMAGES.NAME).where(
            PRODUCTS_IMAGES.COLUMNS.PRODUCT_CODE,
            product.products_code
          );

          return {
            ...product,
            products_images
          };
        })
      );

      return {
        cart_lines
      };
    });

    return response;
  }

  async function getCartItemsForCartCount({ customers_id, logTrace }) {
    const knex = this;
    const query = knex(CART.NAME).where(
      CART.COLUMNS.CUSTOMERS_ID,
      customers_id
    );

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Cart Items Using CustomerId",
      logTrace
    });

    const response = await query;
    return response;
  }

  async function clearCartItems({ customers_id, logTrace }) {
    const knex = this;
    const query = knex(CART.NAME)
      .where(CART.COLUMNS.CUSTOMERS_ID, customers_id)
      .del();

    logQuery({
      logger: fastify.log,
      query,
      context: "Delete Cart Items Using CustomerId and OutletId",
      logTrace
    });

    const response = await query;
    return response;
  }

  return {
    getQuantityOfItemInCart,
    deleteItemFromCart,
    updateQuantityOfItemInCart,
    addItemToCart,
    getItemsInCart,
    getCartItemsForCartCount,
    clearCartItems,
    updateCartItemRate
  };
}

module.exports = customerCartRepo;
