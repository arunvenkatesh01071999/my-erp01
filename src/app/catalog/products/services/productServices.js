const productRepo = require("../repository/products");

// function getProductService(fastify) {
//   const { getProduct } = productRepo(fastify);

//   return async ({ logTrace }) => {
//     const knex = fastify.knexMedical;
//     const response = await getProduct.call(knex, {
//       logTrace
//     });
//     return response;
//   };
// }
function getProductService(fastify) {
  const { getProduct } = productRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getProduct.call(knex, {
      page_size: params.page_size,
      current_page: params.current_page,
      params,
      logTrace
    });
    return response;
  };
}

function postProductService(fastify) {
  const { postProduct } = productRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const promise1 = postProduct.call(knex, {
      params,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function putProductService(fastify) {
  const { putProduct } = productRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const { product_id } = params;
    const promise1 = putProduct.call(knex, {
      product_id,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function deleteProductService(fastify) {
  const { deleteProduct } = productRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const { product_id } = params;
    const promise1 = deleteProduct.call(knex, {
      product_id,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getPriceService(fastify) {
  const { getPriceByVariants } = productRepo(fastify);

  const getPriceSingleProduct = async ({ logTrace, body }) => {
    const knex = fastify.knexMedical;
    const { products_code, units_id } = body;
    console.log(`products_code${products_code}`);
    const priceInfo = await getPriceByVariants.call(knex, {
      logTrace,
      products_code,
      units_id
    });

    return priceInfo;
  };

  return { getPriceSingleProduct };
}
function getProductDetailService(fastify) {
  const { getProductDetail } = productRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getProductDetail.call(knex, {
      product_code: params.product_code,
      logTrace
    });
    return response;
  };
}
function subCategoryCountService(fastify) {
  const { subCategoryCount } = productRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const { category_id } = body;
    const promise1 = subCategoryCount.call(knex, {
      category_id,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    // Calculate the total products_count
    const totalProductsCount = response.reduce((acc, category) => {
      return acc + parseInt(category.products_count);
    }, 0);

    // Create the new object
    const newObject = {
      all: "All",
      category_id: category_id,
      count: totalProductsCount.toString()
    };

    // Add the new object to the beginning of the array
    response.unshift(newObject);

    return response;
  };
}
function getProductBySubCategoryService(fastify) {
  const { getProductBySubCategory } = productRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getProductBySubCategory.call(knex, {
      subcategory_id: params.subcategory_id,
      page_size: params.page_size,
      current_page: params.current_page,
      logTrace
    });
    return response;
  };
}
function getProductByCategoryService(fastify) {
  const { getProductByCategory } = productRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getProductByCategory.call(knex, {
      category_id: params.category_id,
      page_size: params.page_size,
      current_page: params.current_page,
      logTrace
    });
    return response;
  };
}
function getProductByBrandService(fastify) {
  const { getProductByBrand } = productRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getProductByBrand.call(knex, {
      brand_id: params.brand_id,
      page_size: params.page_size,
      current_page: params.current_page,
      logTrace
    });
    return response;
  };
}
module.exports = {
  getProductService,
  postProductService,
  putProductService,
  deleteProductService,
  getPriceService,
  getProductDetailService,
  subCategoryCountService,
  getProductBySubCategoryService,
  getProductByCategoryService,
  getProductByBrandService
};
