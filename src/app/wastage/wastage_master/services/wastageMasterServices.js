const wastageMasterRepo = require("../repository/wastageMaster");



function postWastageMasterService(fastify) {
  const { postWastageMaster } = wastageMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postWastageMaster.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getWastageDocnoService(fastify) {
  const { getWastageDocno } = wastageMasterRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getWastageDocno.call(knex, {
      params,
      logTrace
    });

    return response;
  };
}



module.exports = {
  postWastageMasterService,
  getWastageDocnoService
};
