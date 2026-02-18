const mainCategoryRepo = require("../repository/category");
const subCategoryRepo = require("../repository/subCategory");

function patchCategoryImageService(fastify) {
  const { getMainCategoryById, updateMainCategoryImageById } =
    mainCategoryRepo(fastify);
  const { getSubCategoryById, updateSubCategoryImageById } =
    subCategoryRepo(fastify);

  return async ({ logTrace, params, body }) => {
    const { knexCatalog } = fastify;

    const { category_id } = params;

    if (category_id.startsWith("P_")) {
      return { success: true };
    }

    const finalCategoryId = Number(category_id.split("_")[1]);

    let { media_id } = body[0];
    const primaryMedia = body.find(val => val.is_primary_for_store);

    if (primaryMedia) {
      media_id = primaryMedia.media_id;
    }

    if (category_id.startsWith("1_")) {
      const categoryData = await getMainCategoryById.call(knexCatalog, {
        input: { main_category_id: finalCategoryId },
        logTrace
      });
      const regexForReplacingSpecialChar = /[^\w\s]/gi;
      const regexForReplacingSpace = /\s+/gi;
      const title = categoryData.MCatName.replace(
        regexForReplacingSpecialChar,
        ""
      )
        .replace(regexForReplacingSpace, "-")
        .toLowerCase();

      const image_url = `${fastify.config.MEDIA_SERVING_BASE_URL}/v1/categories/images/${media_id}/${title}.webp`;

      await updateMainCategoryImageById.call(knexCatalog, {
        input: { main_category_id: finalCategoryId, image_url },
        logTrace
      });

      return { success: "true" };
    }

    const categoryData = await getSubCategoryById.call(knexCatalog, {
      input: { sub_category_id: finalCategoryId },
      logTrace
    });
    const regexForReplacingSpecialChar = /[^\w\s]/gi;
    const regexForReplacingSpace = /\s+/gi;
    const title = categoryData.SCatName.replace(
      regexForReplacingSpecialChar,
      ""
    )
      .replace(regexForReplacingSpace, "-")
      .toLowerCase();

    const image_url = `${fastify.config.MEDIA_SERVING_BASE_URL}/v1/categories/images/${media_id}/${title}.png`;

    await updateSubCategoryImageById.call(knexCatalog, {
      input: { sub_category_id: finalCategoryId, image_url },
      logTrace
    });

    return { success: "true" };
  };
}
module.exports = patchCategoryImageService;
