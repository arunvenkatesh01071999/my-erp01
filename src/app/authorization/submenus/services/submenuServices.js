const submenuRepo = require("../repository/submenu");

function getSubMenuService(fastify) {
  const { getSubMenu } = submenuRepo(fastify);

  return async ({ params, body, logTrace, query, userDetails }) => {
    const knex = fastify.knexMedical;
    const response = await getSubMenu.call(knex, {
      params,
      body,
      query_string: query,
      logTrace
    });

    const menuResponse = response.data.map((e) => {
      let warehouse_type = null;

      // Calculate warehouse_type for the main object
      if (e.is_outlet === true && e.is_warehouse === true) {
        warehouse_type = 2;
      } else if (e.is_warehouse === true) {
        warehouse_type = 1;
      } else if (e.is_outlet === true) {
        warehouse_type = 0;
      }

      // Calculate warehouse_type for menu_id if present
      if (e.menu_id) {
        e.menu_id.warehouse_type = (e.menu_id.is_outlet && e.menu_id.is_warehouse)
          ? 2
          : e.menu_id.is_warehouse
            ? 1
            : e.menu_id.is_outlet
              ? 0
              : null;
      }

      return {
        ...e,
        warehouse_type, // Add warehouse_type to the main object
      };
    });

    const finalResponse = {
      data: menuResponse,
      meta: response.meta,
    };

    return finalResponse;
  };
}

function postSubMenuService(fastify) {
  const { postSubMenu } = submenuRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postSubMenu.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function putSubMenuService(fastify) {
  const { putSubMenu } = submenuRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { submenu_id } = params;
    const promise1 = putSubMenu.call(knex, {
      submenu_id,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function deleteSubMenuService(fastify) {
  const { deleteSubMenu } = submenuRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const { submenu_id } = params;
    const promise1 = deleteSubMenu.call(knex, {
      submenu_id,
      params,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function submenuListService(fastify) {
  const { submenuList } = submenuRepo(fastify);

  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await submenuList.call(knex, {
      params,
      body,
      logTrace
    });
    return response;
  };
}

module.exports = {
  getSubMenuService,
  submenuListService,
  postSubMenuService,
  putSubMenuService,
  deleteSubMenuService
};
