const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const { ORDER_ADJUSTMENT_REFERENCE } = require("../../commons/constants");

const getOrderLineItems = ({
  outlet_id,
  cartItems,
  productPricesMap,
  productsMap,
  delivery_cost,
  order_packing_total
}) => {
  // eslint-disable-next-line complexity
  return cartItems.map(item => {
    const cartItemProductData = productsMap[item.ProdCode];
    const { scm_info, attributes } = cartItemProductData;
    const cartItemProductPackId = `${item.ProdCode}-${item.Packid}`;
    const cartItemPack = cartItemProductData.pack_list.find(
      pack => pack.product_pack_id === cartItemProductPackId
    );

    let itemPackName = null;

    itemPackName = attributes.find(({ code }) => code === "display_unit")
      ?.values[0];

    const cartItemSellingPrice =
      productPricesMap[cartItemProductPackId].selling_price;
    const cartItemMRP = productPricesMap[cartItemProductPackId].mrp;

    return {
      order_line_id: uuidv4(),
      item: {
        ksin: item.ProdCode,
        kpn_title: item.ProdName,
        product_pack_id: cartItemProductPackId,
        pack_name: itemPackName || cartItemPack.pack_name,
        legacy_id: cartItemProductData.legacy_id,
        primary_image_url: cartItemPack.media.images[0]?.url,
        requires_shipping: true,
        category_id: cartItemProductData.merchandising_category_l2,
        brand_info: {
          brand_id: cartItemProductData.brand_info.brand_id,
          brand_name: cartItemProductData.brand_info.brand_name
        },
        product_type: cartItemProductData.product_type,
        consumption_mark: cartItemProductData.consumption_mark,
        ...(scm_info?.is_fragile && { is_fragile: scm_info?.is_fragile }),
        ...(scm_info?.is_bulky && { is_bulky: scm_info?.is_bulky }),
        ...(scm_info?.is_dangerous && { is_dangerous: scm_info?.is_dangerous }),
        ...(scm_info?.is_perishable && {
          is_perishable: scm_info?.is_perishable
        })
      },
      quantity: {
        quantity_number: item.Qty,
        quantity_uom: cartItemPack.sale_uom
      },
      price_group: String(outlet_id),
      price_type: "FIXED",
      unit_price: {
        cent_amount: Math.round(cartItemSellingPrice * 100),
        currency: "INR",
        fraction: 100
      },
      mrp: {
        cent_amount: Math.round(cartItemMRP * 100),
        currency: "INR",
        fraction: 100
      },
      tax_included_in_price: true,
      applicable_order_adjustments: [
        ...(order_packing_total > 0
          ? [ORDER_ADJUSTMENT_REFERENCE.PACKING]
          : []),
        ...(delivery_cost > 0 ? [ORDER_ADJUSTMENT_REFERENCE.SHIPPING] : [])
      ]
    };
  });
};

const getOrderTotals = ({
  order_sub_total,
  order_packing_total,
  delivery_cost,
  discount_value,
  order_grand_total,
  loyalty_used
}) => {
  return [
    {
      type: "ITEM_TOTAL",
      multiplier: 1,
      amount: {
        cent_amount: Math.round(order_sub_total * 100),
        currency: "INR",
        fraction: 100
      }
    },
    {
      type: "PACKING_TOTAL",
      multiplier: 1,
      amount: {
        cent_amount: Math.round(order_packing_total * 100),
        currency: "INR",
        fraction: 100
      }
    },
    {
      type: "SHIPPING_TOTAL",
      multiplier: 1,
      amount: {
        cent_amount: Math.round(delivery_cost * 100),
        currency: "INR",
        fraction: 100
      }
    },
    {
      type: "DISCOUNT_TOTAL",
      multiplier: -1,
      amount: {
        cent_amount: Math.round(discount_value * 100),
        currency: "INR",
        fraction: 100
      }
    },
    {
      type: "GRAND_TOTAL",
      multiplier: 1,
      amount: {
        cent_amount: Math.round(
          (Number(order_grand_total) + Number(loyalty_used)) * 100
        ),
        currency: "INR",
        fraction: 100
      }
    }
  ];
};

const getDeliveryGroups = ({
  outlet_id,
  orderLines,
  delivery_cost,
  orderCreationDateTime,
  delivery_eta_in_mins
}) => {
  const formattedDeliveryDate = moment(orderCreationDateTime.toISOString())
    .add(Number(delivery_eta_in_mins), "m") // Delivery Time offset of 45 mins
    .toISOString();

  return [
    {
      delivery_group_id: uuidv4(),
      delivery_method: "HOME-DELIVERY",
      outlet_id: String(outlet_id),
      requested_delivery_info: {
        from_date_time: formattedDeliveryDate,
        to_date_time: formattedDeliveryDate
      },
      promised_delivery_info: {
        from_date_time: formattedDeliveryDate,
        to_date_time: formattedDeliveryDate
      },
      delivery_cost: {
        currency: "INR",
        cent_amount: delivery_cost * 100,
        fraction: 100
      },
      delivery_group_lines: orderLines.map(lineItem => {
        return {
          delivery_group_line_id: uuidv4(),
          order_line_id: lineItem.order_line_id,
          quantity: lineItem.quantity
        };
      })
    }
  ];
};

const getAddress = ({
  customer,
  address_id,
  address,
  isShippingAddress = false
}) => {
  return {
    address_id: String(address_id),
    ...(isShippingAddress && {
      type: address.address_type,
      recipient_name: address.address_name
    }),
    address_line1: address.Add1,
    address_line2: address.Add2,
    address_line3: address.Add3
      ? `${address.Add3}, ${address.full_Address}`
      : address.full_Address,
    landmark: address.LandMark,
    municipal: "",
    city: address.City,
    state_code: "",
    state: "",
    country_code: "",
    country: "",
    post_code: address.Pincode,
    geo_location: {
      latitude: Number(address.lat),
      longitude: Number(address.lang)
    },
    email_id: customer.email_id,
    phone_number: customer.phone_number
  };
};

const getCustomerDetails = ({ customer }) => {
  return {
    customer_id: customer.customer_id,
    customer_group: "B2C",
    customer_type: "INDIVIDUAL",
    customer_name: `${customer.first_name} ${customer.last_name}`.trim(),
    email_id: customer.email_id,
    phone_number: customer.phone_number,
    is_b2b_customer: false
  };
};

const getOrderAdjustments = ({ order_packing_total, delivery_cost }) => {
  const orderAdjustments = [
    ...(order_packing_total > 0
      ? [
          {
            type: "CHARGE",
            applicability: "PACKING",
            reference: ORDER_ADJUSTMENT_REFERENCE.PACKING,
            reference_code: `${
              ORDER_ADJUSTMENT_REFERENCE.PACKING
            }_${new Date().getTime()}`,
            description: "",
            multiplier: 1,
            amount: {
              cent_amount: Math.round(order_packing_total * 10000),
              currency: "INR",
              fraction: 10000
            },
            tax_included_in_amount: true
          }
        ]
      : []),
    ...(delivery_cost > 0
      ? [
          {
            type: "CHARGE",
            applicability: "SHIPPING",
            reference: ORDER_ADJUSTMENT_REFERENCE.SHIPPING,
            reference_code: `${
              ORDER_ADJUSTMENT_REFERENCE.SHIPPING
            }_${new Date().getTime()}`,
            description: "",
            multiplier: 1,
            amount: {
              cent_amount: Math.round(delivery_cost * 10000),
              currency: "INR",
              fraction: 10000
            },
            tax_included_in_amount: true
          }
        ]
      : [])
  ];

  return orderAdjustments;
};

module.exports = {
  getAddress,
  getOrderLineItems,
  getOrderTotals,
  getDeliveryGroups,
  getCustomerDetails,
  getOrderAdjustments
};
