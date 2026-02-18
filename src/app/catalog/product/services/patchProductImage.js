const productRepo = require("../repository/product");

function patchProductImageService(fastify) {
  const { getProductByCode, updateProductImageByCode } = productRepo(fastify);

  return async ({ logTrace, params, body }) => {
    const { knexCatalog } = fastify;

    const { product_code } = params;
    const productData = await getProductByCode.call(knexCatalog, {
      input: { product_code },
      logTrace
    });
    let { media_id } = body[0];
    const primaryMedia = body.find(val => val.is_primary_for_store);

    if (primaryMedia) {
      media_id = primaryMedia.media_id;
    }

    const regexForReplacingSpecialChar = /[^\w\s]/gi;
    const regexForReplacingSpace = /\s+/gi;
    const title = productData.ProdName.replace(regexForReplacingSpecialChar, "")
      .replace(regexForReplacingSpace, "-")
      .toLowerCase();

    const image_url = `${fastify.config.MEDIA_SERVING_BASE_URL}/v1/products/images/${media_id}/${title}.webp`;

    await updateProductImageByCode.call(knexCatalog, {
      input: { product_code, image_url },
      logTrace
    });

    return { success: "true" };
  };
}
module.exports = patchProductImageService;
