const { StatusCodes } = require("http-status-codes");

const { CustomError } = require("../../errorHandler");

function priceRepo(fastify) {
  async function getPriceByOutletProdIdAndVariantId({
    logTrace,
    input: { outlet_id, product_pack_id }
  }) {
    const auth = await getAuthToken("PLATFORM");
    const response = await fastify.request({
      url: `${fastify.config.CORE_PRICE_SERVICE_URI}/v1/prices/fetch`,
      method: "POST",
      headers: {
        Authorization: auth,
        ...logTrace
      },
      body: [{ outlet_id, product_pack_id }],
      path: "/price-serving/v1/prices/fetch",
      downstream_system: "core-price-service",
      source_system: "kpn-ecomm-services-node",
      domain: "ecomm",
      functionality: "Fetch Prices"
    });
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Price not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }

  // async function getPricesByOutletProdIdAndVariantIds({ logTrace, inputArr }) {
  //   const auth = await getAuthToken("PLATFORM");
  //   const response = await fastify.request({
  //     url: `${fastify.config.CORE_PRICE_SERVICE_URI}/v1/prices/fetch`,
  //     method: "POST",
  //     headers: {
  //       Authorization: auth,
  //       ...logTrace
  //     },
  //     body: inputArr,
  //     path: "/price-serving/v1/prices/fetch",
  //     downstream_system: "core-price-service",
  //     source_system: "kpn-ecomm-services-node",
  //     domain: "ecomm",
  //     functionality: "Fetch Prices"
  //   });
  //   if (response.length !== inputArr.length) {
  //     throw CustomError.create({
  //       httpCode: StatusCodes.NOT_FOUND,
  //       message: "Price not found for given Product Ids",
  //       property: "",
  //       code: "NOT_FOUND"
  //     });
  //   }
  //   return response;
  // }

  return {
    getPriceByOutletProdIdAndVariantId
  };
}

module.exports = priceRepo;
