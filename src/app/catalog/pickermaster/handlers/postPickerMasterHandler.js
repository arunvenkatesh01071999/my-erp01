const pickermasterService = require("../services/pickermasterService");

function postPickerMasterHandler(fastify) {
  const postPickerMaster = pickermasterService.postPickerMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postPickerMaster({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postPickerMasterHandler;
