const menuRepo = require("../repository/menu");

function getMenuService(fastify) {
  const { getMenu } = menuRepo(fastify);

  return async ({ params, body, logTrace, query, userDetails }) => {
    const knex = fastify.knexMedical;
    const response = await getMenu.call(knex, {
      params,
      body,
      query_string: query,
      logTrace
    });
    let warehouse_type = null;
    const menuResponse = response.data.map((e) => {
      if (e.is_outlet === true && e.is_warehouse === true) {
        warehouse_type = 2;
      } else if (e.is_warehouse === true) {
        warehouse_type = 1;
      } else if (e.is_outlet === true) {
        warehouse_type = 0;
      }
      return { ...e, warehouse_type };  // Add warehouse_type to each item if needed
    });

    const finalResponse = {
      data: menuResponse,  // Place menuResponse under a key if desired
      meta: response.meta,
    };
    return finalResponse;
  };
}
function postMenuService(fastify) {
  const { postMenu } = menuRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postMenu.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function putMenuService(fastify) {
  const { putMenu } = menuRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { menu_id } = params;
    const promise1 = putMenu.call(knex, {
      menu_id,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function deleteMenuService(fastify) {
  const { deleteMenu } = menuRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const { menu_id } = params;
    const promise1 = deleteMenu.call(knex, {
      menu_id,
      params,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function menuListService(fastify) {
  const { menuList } = menuRepo(fastify);

  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await menuList.call(knex, {
      params,
      body,
      logTrace
    });
    let warehouse_type = null;
    const menuResponse = response.map((e) => {
      if (e.is_outlet === true && e.is_warehouse === true) {
        warehouse_type = 2;
      } else if (e.is_warehouse === true) {
        warehouse_type = 1;
      } else if (e.is_outlet === true) {
        warehouse_type = 0;
      }
      console.log(e, "response");
      return { ...e, warehouse_type };  // Add warehouse_type to each item if needed
    });

    return menuResponse;
  };
}

module.exports = {
  getMenuService,
  menuListService,
  postMenuService,
  putMenuService,
  deleteMenuService
};
