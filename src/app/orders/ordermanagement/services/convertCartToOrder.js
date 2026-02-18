const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");

const blockedCartRepo = require("../repository/blocked_cart");
const productRepo = require("../../catalog/product/repository/productV2");
const getPriceService = require("../../price/services/getPriceV2");
// const addressRepo = require("../../accounts/address/repository/getAddress");
const addressRepo = require("../../accounts/address/repository/address");

const {
  getOrderLineItems,
  getOrderTotals,
  getDeliveryGroups,
  getAddress,
  getCustomerDetails,
  getOrderAdjustments
} = require("../transformers/convertCartToOrder");
const { PAYMENT_MODE_MAPPING } = require("../../commons/constants");

function convertCartToOrderService(fastify) {
  const { getItemsInCartLight } = blockedCartRepo(fastify);
  const { getProductByCodes } = productRepo(fastify);
  const { getAddressByCustomerAndAddressId } = addressRepo(fastify);

  const { getPriceMultipleProduct } = getPriceService(fastify);

  const CHANNEL_TO_CODE_MAPPING = { 0: "WEB", 1: "AND", 2: "IOS" };

  return async ({
    logTrace,
    input: { body, loyalty_earned, loyalty_used, payment_intent_id, outletInfo }
  }) => {
    const { knexOrder } = fastify;

    const {
      cart_id,
      custid: customer_id,
      customer,
      cid: outlet_id,
      payment_mode,
      addressID: address_id,
      delivery_rate: delivery_cost,
      sub_total: order_sub_total,
      finalAmount: order_grand_total,
      razorpay_order_id,
      razor_payment_id,
      packAmt: order_packing_total,
      fromVal: order_type,
      splDiscountVal: discount_value,
      verName: app_version
    } = body;

    const cartItems = await getItemsInCartLight.call(knexOrder, {
      logTrace,
      input: { cart_id }
    });

    if (!cartItems.length) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "Cannot Convert Empty Cart to Order",
        property: "",
        code: "BAD_REQUEST"
      });
    }

    const product_codes = cartItems.map(item => {
      return item.ProdCode;
    });

    const [productsData, address, productPricesMap] = await Promise.all([
      getProductByCodes({
        logTrace,
        input: { product_codes: [...new Set(product_codes)] }
      }),
      getAddressByCustomerAndAddressId.call(fastify.knexCustomer, {
        // Need to make DB call here instead of PHP API call
        input: { customer_id, address_id },
        logTrace
      }),
      getPriceMultipleProduct({
        logTrace,
        body: {
          products: cartItems.map(item => {
            return { product_code: item.ProdCode, pack_id: item.Packid };
          }),
          outlet_id
        }
      })
    ]);

    const productsMap = productsData.reduce((acc, product) => {
      acc[product.ksin] = product;
      return acc;
    }, {});

    const orderLines = getOrderLineItems({
      cartItems,
      productPricesMap,
      productsMap,
      outlet_id,
      delivery_cost,
      order_packing_total
    });
    const orderCreationDateTime = new Date();
    const orderData = {
      version: app_version,
      outlet_id: String(outlet_id),
      created_at: orderCreationDateTime.toISOString(),
      order_type: "REGULAR",
      cart_origin: CHANNEL_TO_CODE_MAPPING[order_type],
      customer: getCustomerDetails({ customer }),
      shipping_address: getAddress({
        customer,
        address,
        address_id,
        isShippingAddress: true
      }),
      pickup: {
        outlet_id: String(outlet_id)
      },
      billing_instruction: {
        invoice_type: "INVOICE",
        billing_address: getAddress({
          customer,
          address,
          address_id,
          isShippingAddress: false
        })
      },
      order_lines: orderLines,
      order_adjustments: getOrderAdjustments({
        order_packing_total,
        delivery_cost
      }),
      order_totals: getOrderTotals({
        order_sub_total,
        order_packing_total,
        delivery_cost,
        discount_value,
        order_grand_total,
        loyalty_used
      }),
      loyalty: {
        loyalty_points_earned: Math.floor(Number(loyalty_earned)),
        loyalty_points_used: Math.floor(Number(loyalty_used))
      },
      order_channel: {
        channel: CHANNEL_TO_CODE_MAPPING[order_type]
      },
      payment: {
        payment_type: PAYMENT_MODE_MAPPING[payment_mode],
        payment_status: payment_mode === "0" ? "PENDING" : "COMPLETED",
        payment_intent_id
      },
      delivery_groups: getDeliveryGroups({
        outlet_id,
        orderLines,
        delivery_cost,
        orderCreationDateTime,
        delivery_eta_in_mins: outletInfo.fulfilment_info.delivery_eta_in_mins
      }),
      custom_info: [
        {
          group: "PAYMENT",
          id: "razor_pay_order_id",
          values: [razorpay_order_id]
        },
        {
          group: "PAYMENT",
          id: "razor_pay_transaction_id",
          values: [razor_payment_id]
        }
      ]
    };

    return {
      order_lines: cartItems.map((item, index) => {
        return {
          order_line_id: index + 1,
          product_id: item.ProdId,
          product_name: item.ProdName,
          image_url: item.ImgPath1,
          quantity: item.Qty,
          product_rate: item.Rate,
          product_price: item.Rate * item.Qty,
          pack_id: productsMap[item.ProdCode].has_packs
            ? item.Packid
            : productsMap[item.ProdCode].kpn_uom_id,
          product_code: item.ProdCode
        };
      }),
      orderData
    };
  };
}
module.exports = convertCartToOrderService;
