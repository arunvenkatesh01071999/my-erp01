const issueTransferRepo = require("../repository/issueTransfer");


function postIssueTransferTempService(fastify) {
  const { postIssueTransferTemp } = issueTransferRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postIssueTransferTemp.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function deleteIssueTransferTempService(fastify) {
  const { deleteIssueTransferTemp } = issueTransferRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = deleteIssueTransferTemp.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deleteAllIssueTransferTempService(fastify) {
  const { deleteAllIssueTransferTemp } = issueTransferRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = deleteAllIssueTransferTemp.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}




function getIssueTransferTempDetailsService(fastify) {
  const { getIssueTransferTempDetails } = issueTransferRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getIssueTransferTempDetails.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


module.exports = {
  postIssueTransferTempService,
  getIssueTransferTempDetailsService,
  deleteIssueTransferTempService,
  deleteAllIssueTransferTempService
};
