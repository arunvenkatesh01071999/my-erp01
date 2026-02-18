const roleRepo = require("../repository/roles");

function getRoleService(fastify) {
  const { getRole } = roleRepo(fastify);

  return async ({ params, body, query, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getRole.call(knex, {
      params,
      body,
      queryString: query,
      logTrace
    });
    console.log(response, "respo nse")
    const updatedResponse = {
      ...response,
      data: response.data.map((e) => {
        let warehouse_type;

        if (e.is_outlet === true && e.is_warehouse === true) {
          warehouse_type = 2;
        } else if (e.is_outlet === false && e.is_warehouse === true) {
          warehouse_type = 1;
        } else if (e.is_outlet === true && e.is_warehouse === false) {
          warehouse_type = 0;
        } else {
          warehouse_type = null; // Default case
        }

        return {
          ...e,
          warehouse_type, // Add the new field
        };
      }),
    };

    return updatedResponse;
  };
}
function getRoleListService(fastify) {
  const { getRoleList } = roleRepo(fastify);

  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getRoleList.call(knex, {
      params,
      body,
      logTrace
    });

    console.log(response, "response")

    // Map data to include warehouse_type
    const updatedData = response.map((e) => {
      let warehouse_type;

      if (e.is_outlet && e.is_warehouse) {
        warehouse_type = 2;
      } else if (!e.is_outlet && e.is_warehouse) {
        warehouse_type = 1;
      } else if (e.is_outlet && !e.is_warehouse) {
        warehouse_type = 0;
      } else {
        warehouse_type = null; // Default if neither is true
      }

      return { ...e, warehouse_type };
    });

    return updatedData;
  };
}
function getRoleInfoService(fastify) {
  const { getRoleInfo } = roleRepo(fastify);

  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getRoleInfo.call(knex, {
      params,
      body,
      logTrace
    });

    return response;
  };
}
function postRoleService(fastify) {
  const { postRole } = roleRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postRole.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function putRoleService(fastify) {
  const { putRole } = roleRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { role_id, company_id } = params;
    const promise1 = putRole.call(knex, {
      role_id,
      company_id,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function deleteRoleService(fastify) {
  const { deleteRole } = roleRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { role_id, company_id } = params;
    const promise1 = deleteRole.call(knex, {
      role_id,
      company_id,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

module.exports = {
  getRoleService,
  postRoleService,
  putRoleService,
  deleteRoleService,
  getRoleInfoService,
  getRoleListService
};
