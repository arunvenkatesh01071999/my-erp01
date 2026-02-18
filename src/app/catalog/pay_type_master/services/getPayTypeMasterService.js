const getPayTypeMasterRepo = require("../repository/getPayTypeMasterRepo.js");
// const { queryString } = require("../schemas/getPayTypeMasterSchema.js");

function getPayTypeMasterService(fastify) {
  const { getPayTypeMaster } = getPayTypeMasterRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    // console.log(query, "query")
    const response = await getPayTypeMaster.call(knex, {
      body,
      params,
      logTrace,
      queryString: query
    });
    return response;

  };
}

// function getPayTypeMasterService(fastify) {
//   const { getPayTypeMaster } = getPayTypeMasterRepo(fastify);

//   return async ({ body, params, logTrace }) => {
//     const knex = fastify.knexMedical;
//     const response = await getPayTypeMaster.call(knex, {
//       body, params, logTrace
//     });
//     return response;

//   };
// }



function postPayTypeMasterService(fastify) {
  const { postPayTypeMaster } = getPayTypeMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postPayTypeMaster.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putPayTypeMasterService(fastify) {
  const { putPayTypeMaster } = getPayTypeMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { id } = params;
    const promise1 = putPayTypeMaster.call(knex, {
      id,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deletePayTypeMasterService(fastify) {
  const { deletePayTypeMaster } = getPayTypeMasterRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const { id } = params;
    const promise1 = deletePayTypeMaster.call(knex, {
      id,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


module.exports = {
  getPayTypeMasterService,
  postPayTypeMasterService,
  putPayTypeMasterService,
  deletePayTypeMasterService,
  getPayTypeMasterService
};
