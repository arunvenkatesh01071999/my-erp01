const pickermasterService = require("../services/pickermasterService");

function deletePickerMasterHandler(fastify) {
  const deletePickerMaster = pickermasterService.deletePickerMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await deletePickerMaster({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = deletePickerMasterHandler;
