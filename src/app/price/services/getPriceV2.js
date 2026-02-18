const priceRepo = require("../repository/priceV2");

function getPriceService(fastify) {
  const {
    getPriceByOutletProdIdAndVariantId,
    getPricesByOutletProdIdAndVariantIds
  } = priceRepo(fastify);

  const getPriceSingleProduct = async ({ logTrace, body }) => {
    const { products_code, units_id } = body;
    const priceInfo = await getPriceByOutletProdIdAndVariantId({
      logTrace,
      input: {
        products_code,
        units_id
      }
    });
    const { mrp, unit_price } = priceInfo.outlet_prices;

    return {
      selling_price: unit_price.cent_amount / unit_price.fraction,
      mrp: mrp.cent_amount / mrp.fraction
    };
  };

  const getPriceMultipleProduct = async ({ logTrace, body }) => {
    const { products, outlet_id } = body;
    const inputArr = products.map(({ product_code, pack_id }) => {
      return {
        product_pack_id: `${product_code}-${pack_id}`,
        outlet_id
      };
    });

    const allProductPriceInfo = await getPricesByOutletProdIdAndVariantIds({
      logTrace,
      inputArr
    });

    const productPackToPriceMap = allProductPriceInfo.reduce((acc, val) => {
      const {
        product_pack_id,
        outlet_prices: { mrp, unit_price },
        outlet_discounts: { discount_value }
      } = val;
      acc[product_pack_id] = {
        selling_price: unit_price.cent_amount / unit_price.fraction,
        mrp: mrp.cent_amount / mrp.fraction,
        discount: discount_value.cent_amount / discount_value.fraction
      };
      return acc;
    }, {});

    return products.reduce((acc, val) => {
      const { product_code, pack_id } = val;
      const productPackId = `${product_code}-${pack_id}`;
      acc[productPackId] = productPackToPriceMap[productPackId];
      return acc;
    }, {});
  };

  return { getPriceSingleProduct, getPriceMultipleProduct };
}
module.exports = getPriceService;
