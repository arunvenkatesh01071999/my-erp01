const consumerRepo = require("../repository/consumer");

function getConsumerService(fastify) {
  const { getConsumer } = consumerRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getConsumer.call(knex, {
      logTrace
    });
    return response;

  };
}

function getConsumerPaginateService(fastify) {
  const { getConsumerPaginate } = consumerRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getConsumerPaginate.call(knex, {
      params,
      logTrace
    });
    return response;
  };

}

function postConsumerService(fastify) {
  const { postConsumer } = consumerRepo(fastify);
  return async ({ params, body, logTrace,userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postConsumer.call(knex, {
      params,
      body,
      logTrace,userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putConsumerService(fastify) {
  const { putConsumer } = consumerRepo(fastify);
  return async ({ params, body, logTrace,userDetails }) => {
    const knex = fastify.knexMedical;
    const { consumer_id } = params;
    const promise1 = putConsumer.call(knex, {
      consumer_id,
      body,
      logTrace,userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deleteConsumerService(fastify) {
  const { deleteConsumer } = consumerRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const { consumer_id } = params;
    const promise1 = deleteConsumer.call(knex, {
      consumer_id,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getConsumerInfoService(fastify) {
  const { getConsumerInfo } = consumerRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getConsumerInfo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

module.exports = {
  getConsumerService,
  postConsumerService,
  putConsumerService,
  deleteConsumerService,
  getConsumerInfoService,
  getConsumerPaginateService
};
