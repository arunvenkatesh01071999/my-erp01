const pickermasterService = require("../services/pickermasterService");

function putPickerMasterHandler(fastify) {
  const putPickerMaster = pickermasterService.putPickerMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putPickerMaster({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putPickerMasterHandler;
