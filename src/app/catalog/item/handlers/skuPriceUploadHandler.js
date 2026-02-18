const ItemServices = require("../services/itemServices");

function skuPriceUploadHandler(fastify) {
  const skuPriceUpload = ItemServices.skuPriceUploadService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace,userDetails } = request;
    const response = await skuPriceUpload({ params, body, logTrace,userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = skuPriceUploadHandler;
