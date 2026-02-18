const { StatusCodes } = require("http-status-codes");
const {
  getAuthToken
} = require("@kovai-pazhamudir-nilayam/kpn-platform-token");
const { CustomError } = require("../../../errorHandler");

function productRepo(fastify) {
  async function getProductByCodes({ logTrace, input: { product_codes } }) {
    const auth = await getAuthToken("PLATFORM");
    const response = await fastify.request({
      url: `${fastify.config.CORE_CATALOG_SERVICE_URI}/v1/products/fetch`,
      method: "POST",
      headers: {
        ...logTrace,
        Authorization: auth,
        "x-channel-id": "WEB"
      },
      body: {
        ksins: product_codes,
        catalog_version: "ONLINE",
        include_packlist: true,
        include_media: true
      },
      path: "/core-catalog/v1/products/fetch",
      downstream_system: "core-catalog-service",
      source_system: "kpn-ecomm-services-node",
      domain: "ecomm",
      functionality: "Fetch Products"
    });
    if (response.length !== product_codes.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Product not found for given Product Codes",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  return {
    getProductByCodes
  };
}

module.exports = productRepo;
