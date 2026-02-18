const allPackingIssueRepo = require("../repository/allPackingIssueRepo");



function postPackingIssueService(fastify) {
  const { postPackingIssue } = allPackingIssueRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postPackingIssue.call(knex, {
      params, body, logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getPackingIssueDocnoService(fastify) {
  const { getPackingIssueDocno } = allPackingIssueRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getPackingIssueDocno.call(knex, {
      params, body, logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getPackingIssuePdfService(fastify) {
  const { getPackingIssuePdf } = allPackingIssueRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getPackingIssuePdf.call(knex, {
      params, body, logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function postPackingInwardService(fastify) {
  const { postPackingInward } = allPackingIssueRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postPackingInward.call(knex, {
      params, body, logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function getPackingInwardService(fastify) {
  const { getPackingInward } = allPackingIssueRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getPackingInward.call(knex, {
      params, body, logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getPackingInwardDocnoService(fastify) {
  const { getPackingInwardDocno } = allPackingIssueRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getPackingInwardDocno.call(knex, {
      params, body, logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

module.exports = {
  postPackingIssueService,
  postPackingInwardService,
  getPackingIssueDocnoService,
  getPackingInwardDocnoService,
  getPackingInwardService,
  getPackingIssuePdfService
};
