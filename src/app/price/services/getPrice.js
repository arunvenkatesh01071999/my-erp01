const priceRepo = require("../repository/price");
const productRepo = require("../../catalog/product/repository/product");
const productPackRepo = require("../../catalog/product/repository/productPack");

function getPriceService(fastify) {
  const { getPackInfoByProdAndPackId, getPackInfoByProdIdsAndPackIds } =
    productPackRepo(fastify);
  const { getPriceByOutletAndProdId, getPricesByOutletAndProdIds } =
    priceRepo(fastify);
  const { getProductById, getProductByIds } = productRepo(fastify);

  function getProductPrice({ priceInfo }) {
    if (priceInfo.dsr > 0) {
      return priceInfo.dsr;
    }
    return priceInfo.Rate;
  }

  function getProductPriceFromPack({ packInfo, priceInfo }) {
    if (packInfo.Wt === 1) {
      if (priceInfo.dmrp > 0) {
        const ograte = priceInfo.dsr / 10;
        return ograte * (packInfo.Wt * 10);
      }
      const ograte = priceInfo.Rate / 10;
      return ograte * (packInfo.Wt * 10);
    }
    if (priceInfo.dmrp > 0) {
      const ograte = priceInfo.dsr / 10;
      return ograte * (packInfo.Wt * 10);
    }
    const ograte = priceInfo.Rate / 10;
    return ograte * (packInfo.Wt * 10);
  }

  const getPriceSingleProduct = async ({ logTrace, body }) => {
    const { product_id, outlet_id, pack_id } = body;
    const { knexCatalog } = fastify;
    const [productInfo, priceInfo] = await Promise.all([
      getProductById.call(knexCatalog, {
        logTrace,
        input: { product_id }
      }),

      getPriceByOutletAndProdId.call(knexCatalog, {
        logTrace,
        input: { product_id, outlet_id }
      })
    ]);

    if (productInfo.Munit === 0 || productInfo.Munit === null) {
      return getProductPrice({ priceInfo });
    }
    const packInfo = await getPackInfoByProdAndPackId.call(knexCatalog, {
      logTrace,
      input: { product_id, pack_id }
    });

    if (packInfo) {
      return getProductPriceFromPack({ packInfo, priceInfo });
    }

    return getProductPrice({ priceInfo });
  };

  const getPriceMultipleProduct = async ({ logTrace, body }) => {
    const { products, outlet_id } = body;
    const product_ids = products.map(val => val.product_id);
    const uniqueProductIds = [...new Set(product_ids)];

    const { knexCatalog } = fastify;
    const [allProductInfo, allProductPriceInfo] = await Promise.all([
      getProductByIds.call(knexCatalog, {
        logTrace,
        input: { product_ids: uniqueProductIds }
      }),

      getPricesByOutletAndProdIds.call(knexCatalog, {
        logTrace,
        input: { product_ids: uniqueProductIds, outlet_id }
      })
    ]);

    const productIdToMunitMap = allProductInfo.reduce((acc, val) => {
      acc[val.ProdId] = val.Munit;
      return acc;
    }, {});

    const productsWithPacks = products.filter(val => {
      return !(
        productIdToMunitMap[val.product_id] === 0 ||
        productIdToMunitMap[val.product_id] === null
      );
    });

    const priceInfoMap = allProductPriceInfo.reduce((acc, val) => {
      acc[val.ProdId] = val;
      return acc;
    }, {});

    if (!productsWithPacks.length) {
      return products.reduce((acc, val) => {
        const { product_id, pack_id } = val;
        const priceInfoOfProduct = priceInfoMap[product_id];
        const key = `${product_id}_${pack_id}`;
        acc[key] = getProductPrice({
          priceInfo: priceInfoOfProduct
        });
        return acc;
      }, {});
    }
    const productToPackIdsUnderScoreSeparated = productsWithPacks.map(
      val => `${val.product_id}_${val.pack_id}`
    );
    const allProductPackInfo = await getPackInfoByProdIdsAndPackIds.call(
      knexCatalog,
      {
        logTrace,
        input: { product_to_pack_ids: productToPackIdsUnderScoreSeparated }
      }
    );

    const productPackMap = allProductPackInfo.reduce((acc, val) => {
      const { Packid, ProdId } = val;
      const key = `${ProdId}_${Packid}`;
      acc[key] = val;
      return acc;
    }, {});

    return products.reduce((acc, val) => {
      const { product_id, pack_id } = val;
      const key = `${product_id}_${pack_id}`;
      if (
        productIdToMunitMap[product_id] === 0 ||
        productIdToMunitMap[product_id] === null
      ) {
        acc[key] = getProductPrice({
          priceInfo: priceInfoMap[product_id]
        });
        return acc;
      }

      if (Object.hasOwnProperty.call(productPackMap, key)) {
        acc[key] = getProductPriceFromPack({
          packInfo: productPackMap[key],
          priceInfo: priceInfoMap[product_id]
        });
        return acc;
      }

      acc[key] = getProductPrice({
        priceInfo: priceInfoMap[product_id]
      });
      return acc;
    }, {});

    /*  return allProductInfo.reduce((acc, val) => {
      const { ProdId: product_id } = val;

      if (
        productIdToMunitMap[product_id] === 0 ||
        productIdToMunitMap[product_id] === null
      ) {
        acc[product_id] = getProductPrice({
          priceInfo: priceInfoMap[product_id]
        });
        return acc;
      }
      if (Object.hasOwnProperty.call(productPackMap, product_id)) {
        acc[product_id] = getProductPriceFromPack({
          packInfo: productPackMap[product_id],
          priceInfo: priceInfoMap[product_id]
        });
        return acc;
      }

      acc[product_id] = getProductPrice({
        priceInfo: priceInfoMap[product_id]
      });
      return acc;
    }, {}); */
  };

  return { getPriceSingleProduct, getPriceMultipleProduct };
}
module.exports = getPriceService;
