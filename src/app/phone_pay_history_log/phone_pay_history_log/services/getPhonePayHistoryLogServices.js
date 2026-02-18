const getPhonePayHistoryLogRepo = require("../repository/getPhonePayHistoryLogRepo.js");



function postPhonePayHistoryLogService(fastify) {
  const { postPhonePayHistoryLog } = getPhonePayHistoryLogRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postPhonePayHistoryLog.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


module.exports = {
  postPhonePayHistoryLogService
};
